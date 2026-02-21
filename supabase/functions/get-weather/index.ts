const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const city = url.searchParams.get('city');
    const lat = url.searchParams.get('lat');
    const lon = url.searchParams.get('lon');
    const units = url.searchParams.get('units') || 'metric';

    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let locationQuery = '';
    if (city) {
      const sanitized = city.trim().replace(/[^a-zA-Z0-9\s,.-]/g, '').substring(0, 100);
      if (!sanitized) {
        return new Response(JSON.stringify({ error: 'Invalid city name' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      locationQuery = `q=${encodeURIComponent(sanitized)}`;
    } else if (lat && lon) {
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
        return new Response(JSON.stringify({ error: 'Invalid coordinates' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      locationQuery = `lat=${latNum}&lon=${lonNum}`;
    } else {
      return new Response(JSON.stringify({ error: 'City or coordinates required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch current weather and forecast in parallel
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?${locationQuery}&units=${units}&appid=${apiKey}`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?${locationQuery}&units=${units}&appid=${apiKey}`),
    ]);

    if (!currentRes.ok) {
      const err = await currentRes.json();
      const status = currentRes.status === 404 ? 404 : 500;
      return new Response(JSON.stringify({ error: err.message || 'City not found' }), {
        status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const current = await currentRes.json();
    const forecast = forecastRes.ok ? await forecastRes.json() : null;

    // Process 5-day forecast: pick one entry per day (noon or closest)
    let dailyForecast: any[] = [];
    if (forecast?.list) {
      const days = new Map<string, any>();
      for (const item of forecast.list) {
        const date = item.dt_txt.split(' ')[0];
        const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
        if (!days.has(date) || Math.abs(hour - 12) < Math.abs(parseInt(days.get(date).dt_txt.split(' ')[1].split(':')[0]) - 12)) {
          days.set(date, item);
        }
      }
      // Get min/max for each day
      const dayTemps = new Map<string, { min: number; max: number }>();
      for (const item of forecast.list) {
        const date = item.dt_txt.split(' ')[0];
        const existing = dayTemps.get(date);
        if (!existing) {
          dayTemps.set(date, { min: item.main.temp_min, max: item.main.temp_max });
        } else {
          existing.min = Math.min(existing.min, item.main.temp_min);
          existing.max = Math.max(existing.max, item.main.temp_max);
        }
      }

      const today = new Date().toISOString().split('T')[0];
      dailyForecast = Array.from(days.entries())
        .filter(([date]) => date !== today)
        .slice(0, 5)
        .map(([date, item]) => ({
          date,
          temp_min: Math.round(dayTemps.get(date)!.min),
          temp_max: Math.round(dayTemps.get(date)!.max),
          weather: item.weather[0],
        }));
    }

    const result = {
      city: current.name,
      country: current.sys?.country,
      temp: Math.round(current.main.temp),
      feels_like: Math.round(current.main.feels_like),
      humidity: current.main.humidity,
      wind_speed: current.wind.speed,
      weather: current.weather[0],
      dt: current.dt,
      timezone: current.timezone,
      forecast: dailyForecast,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unable to fetch weather data' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
