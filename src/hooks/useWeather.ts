import { useState, useCallback, useEffect } from "react";
import type { WeatherData, TemperatureUnit } from "@/types/weather";
import { fetchWeather } from "@/lib/weather-api";

const HISTORY_KEY = "weather-search-history";
const MAX_HISTORY = 8;

function getSearchHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSearchHistory(history: string[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>("metric");
  const [searchHistory, setSearchHistory] = useState<string[]>(getSearchHistory);

  const search = useCallback(async (city: string) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeather({ city: city.trim() }, unit);
      setData(result);
      // Update history
      const updated = [result.city, ...searchHistory.filter(h => h.toLowerCase() !== result.city.toLowerCase())].slice(0, MAX_HISTORY);
      setSearchHistory(updated);
      saveSearchHistory(updated);
    } catch (e: any) {
      setError(e.message || "Unable to fetch weather data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [unit, searchHistory]);

  const searchByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeather({ lat, lon }, unit);
      setData(result);
      const updated = [result.city, ...searchHistory.filter(h => h.toLowerCase() !== result.city.toLowerCase())].slice(0, MAX_HISTORY);
      setSearchHistory(updated);
      saveSearchHistory(updated);
    } catch (e: any) {
      setError(e.message || "Unable to fetch weather data");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [unit, searchHistory]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => prev === "metric" ? "imperial" : "metric");
  }, []);

  // Re-fetch when unit changes and we have data
  useEffect(() => {
    if (data) {
      search(data.city);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return { data, loading, error, unit, toggleUnit, search, searchByCoords, searchHistory, clearHistory };
}
