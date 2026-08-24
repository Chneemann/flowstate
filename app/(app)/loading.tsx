/**
 * @file app/(app)/loading.tsx
 * @description Loading skeleton fallback component rendered during async route transitions within the main application group.
 */

/**
 * Renders a full-page animated skeleton UI matching the app layout structure to provide visual feedback during page loads.
 *
 * @returns {JSX.Element} The rendered loading skeleton component.
 */
export default function AppLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-pulse">
      {/* Top Header / Title Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-card rounded-md border border-border" />
          <div className="h-8 w-64 bg-card rounded-md border border-border" />
          <div className="h-4 w-96 bg-card rounded-md border border-border" />
        </div>
        <div className="h-10 w-32 bg-card rounded-lg border border-border" />
      </div>

      {/* Main Content Area Skeletons */}
      <div className="grid grid-auto-fit-450 gap-4">
        <div className="h-36 bg-card rounded-xl border border-border p-4 flex flex-col justify-between">
          <div className="h-5 w-1/3 bg-background-muted rounded" />
          <div className="h-8 w-1/2 bg-background-muted rounded" />
          <div className="h-3 w-1/4 bg-background-muted rounded" />
        </div>
      </div>

      {/* List / Table Skeleton */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div className="h-5 w-40 bg-background-muted rounded" />
        <div className="space-y-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-14 w-full bg-background-muted rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
