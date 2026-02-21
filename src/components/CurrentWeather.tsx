import { Droplets, Wind, Thermometer, Clock } from "lucide-react";
import type { WeatherData, TemperatureUnit } from "@/types/weather";

interface CurrentWeatherProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const unitSymbol = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  const date = new Date((data.dt + data.timezone) * 1000);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

  const iconUrl = `https://openweathermap.org/img/wn/${data.weather.icon}@4x.png`;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Weather icon */}
        <div className="flex-shrink-0">
          <img src={iconUrl} alt={data.weather.description} className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-lg" />
        </div>

        {/* Main info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-body text-muted-foreground">
            {data.city}, {data.country}
          </h2>
          <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-1">
            <span className="text-7xl sm:text-8xl font-display font-bold tracking-tight text-foreground">
              {data.temp}
            </span>
            <span className="text-2xl font-display text-muted-foreground">{unitSymbol}</span>
          </div>
          <p className="text-lg capitalize font-body text-foreground/80 mt-1">
            {data.weather.description}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-1 mt-1 text-sm text-muted-foreground font-body">
            <Clock className="h-3.5 w-3.5" />
            <span>{dateStr} • {timeStr}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <StatCard icon={<Thermometer className="h-5 w-5 text-accent" />} label="Feels like" value={`${data.feels_like}${unitSymbol}`} />
        <StatCard icon={<Droplets className="h-5 w-5 text-primary" />} label="Humidity" value={`${data.humidity}%`} />
        <StatCard icon={<Wind className="h-5 w-5 text-muted-foreground" />} label="Wind" value={`${data.wind_speed} ${windUnit}`} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-muted/50">
      {icon}
      <span className="text-xs text-muted-foreground font-body">{label}</span>
      <span className="text-sm font-semibold font-display text-foreground">{value}</span>
    </div>
  );
}
