import type { ForecastDay, TemperatureUnit } from "@/types/weather";

interface ForecastCardProps {
  forecast: ForecastDay[];
  unit: TemperatureUnit;
}

export function ForecastCard({ forecast, unit }: ForecastCardProps) {
  const unitSymbol = unit === "metric" ? "°" : "°";

  if (!forecast.length) return null;

  return (
    <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
      <h3 className="text-sm font-semibold font-display text-muted-foreground uppercase tracking-wider mb-4">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {forecast.map((day) => {
          const date = new Date(day.date + "T12:00:00");
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
          const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`;

          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl hover:bg-muted/50 transition-colors"
            >
              <span className="text-xs font-semibold font-display text-foreground">{dayName}</span>
              <span className="text-[10px] text-muted-foreground font-body">{monthDay}</span>
              <img src={iconUrl} alt={day.weather.description} className="w-10 h-10 my-1" />
              <span className="text-sm font-bold font-display text-foreground">
                {day.temp_max}{unitSymbol}
              </span>
              <span className="text-xs text-muted-foreground font-body">
                {day.temp_min}{unitSymbol}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
