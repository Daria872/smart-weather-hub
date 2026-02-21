export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  dt: number;
  timezone: number;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  temp_min: number;
  temp_max: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export type TemperatureUnit = 'metric' | 'imperial';
