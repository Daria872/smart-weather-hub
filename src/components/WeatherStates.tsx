import { Loader2, CloudOff, Search } from "lucide-react";

export function LoadingState() {
  return (
    <div className="glass-card rounded-3xl p-12 flex flex-col items-center gap-4 animate-fade-in">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="text-muted-foreground font-body">Fetching weather data...</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="glass-card rounded-3xl p-12 flex flex-col items-center gap-4 animate-fade-in">
      <CloudOff className="h-10 w-10 text-destructive" />
      <p className="text-foreground font-display font-semibold">{message}</p>
      <p className="text-sm text-muted-foreground font-body">Try searching for another city</p>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="glass-card rounded-3xl p-12 flex flex-col items-center gap-4 animate-fade-in">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Search className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-xl font-display font-bold text-foreground">Search for a city</h2>
      <p className="text-sm text-muted-foreground font-body text-center max-w-xs">
        Enter a city name or use your location to get real-time weather conditions and forecasts
      </p>
    </div>
  );
}
