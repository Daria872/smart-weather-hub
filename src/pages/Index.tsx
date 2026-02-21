import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CurrentWeather } from "@/components/CurrentWeather";
import { ForecastCard } from "@/components/ForecastCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/WeatherStates";
import { useWeather } from "@/hooks/useWeather";
import { useTheme } from "@/hooks/useTheme";
import { useCallback } from "react";

const Index = () => {
  const { data, loading, error, unit, toggleUnit, search, searchByCoords, searchHistory } = useWeather();
  const { dark, toggle: toggleTheme } = useTheme();

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => searchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        // Permission denied — do nothing, user will see no data
      }
    );
  }, [searchByCoords]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-xl mx-auto px-4 pb-12">
        <Header dark={dark} onToggleTheme={toggleTheme} unit={unit} onToggleUnit={toggleUnit} />

        <div className="mt-4 mb-8">
          <SearchBar
            onSearch={search}
            onGeolocate={handleGeolocate}
            loading={loading}
            searchHistory={searchHistory}
          />
        </div>

        <div className="space-y-4">
          {loading && <LoadingState />}
          {error && !loading && <ErrorState message={error} />}
          {!loading && !error && !data && <EmptyState />}
          {!loading && !error && data && (
            <>
              <CurrentWeather data={data} unit={unit} />
              <ForecastCard forecast={data.forecast} unit={unit} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
