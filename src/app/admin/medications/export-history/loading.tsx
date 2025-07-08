export default function ExportHistoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-16 bg-sky-200 rounded animate-pulse"></div>
            <div>
              <div className="h-8 w-64 bg-sky-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-sky-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Statistics cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm border border-sky-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-20 bg-sky-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-12 bg-sky-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-10 bg-sky-100 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-lg shadow-lg">
          <div className="p-6">
            <div className="h-6 w-48 bg-sky-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-sky-50 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
