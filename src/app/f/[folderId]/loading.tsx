export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-800" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-800" />
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <ul>
            {[...Array(3)].map((_, i) => (
              <li
                key={i}
                className="border-b border-gray-700 px-6 py-4 transition-colors last:border-none"
              >
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-700" />
                  </div>
                  <div className="col-span-2">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-700" />
                  </div>
                  <div className="col-span-3">
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-700" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
