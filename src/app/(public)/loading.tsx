export default function PublicStoreLoading() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6 font-nunito">
      
      {/* Hero Skeleton */}
      <div className="bg-gray-100 animate-pulse rounded-[32px] p-8 md:p-12 mb-8 h-[200px] w-full" />

      {/* Categories Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar snap-x">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="snap-start py-4 px-10 rounded-full bg-gray-100 animate-pulse" />
        ))}
      </div>

      <div className="flex items-center justify-between mb-5 flex-wrap gap-2.5">
        <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
        <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-lg" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#f0f0f0] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            <div className="relative bg-gray-100 animate-pulse aspect-square" />
            <div className="p-3">
              <div className="h-4 bg-gray-100 animate-pulse rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-100 animate-pulse rounded mb-3 w-1/2" />
              <div className="h-5 bg-gray-100 animate-pulse rounded mb-2 w-1/3" />
              <div className="flex items-center justify-between mt-3">
                <div className="h-3 bg-gray-100 animate-pulse rounded w-1/4" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
