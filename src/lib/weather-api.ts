import type { WeatherData, TemperatureUnit } from "@/types/weather";

export async function fetchWeather(
  params: { city?: string; lat?: number; lon?: number },
  units: TemperatureUnit = 'metric'
): Promise<WeatherData> {
  const queryParams: Record<string, string> = { units };
  if (params.city) queryParams.city = params.city;
  if (params.lat !== undefined && params.lon !== undefined) {
    queryParams.lat = String(params.lat);
    queryParams.lon = String(params.lon);
  }

  const queryString = new URLSearchParams(queryParams).toString();
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const url = `https://${projectId}.supabase.co/functions/v1/get-weather?${queryString}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || 'Unable to fetch weather data');
  }
  return data as WeatherData;
}
