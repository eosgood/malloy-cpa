export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold text-blue-800 leading-tight">
            Malloy Accounting LLC
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Family-owned tax practice servicing individuals and small businesses 
            of the Central Valley. Professional CPA services you can trust.
          </p>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            Get Started
          </button>
        </div>
        
        {/* Status Section */}
        <div className="mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Project Status
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-6">
              <span className="text-sm md:text-base font-semibold text-green-600">
                ✅ Next.js 15 + App Router
              </span>
              <span className="text-sm md:text-base font-semibold text-green-600">
                ✅ Tailwind CSS
              </span>
              <span className="text-sm md:text-base font-semibold text-green-600">
                ✅ TypeScript
              </span>
              <span className="text-sm md:text-base font-semibold text-green-600">
                ✅ SSR Optimized
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
