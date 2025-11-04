import Hero from '@/components/Hero';

export default function About() {
  return (
    <div className="bg-white">
      <Hero
        title="About Malloy Accounting LLC"
        subtitle="Family-owned tax practice with a commitment to personalized service and professional excellence."
      />

      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Meet Jack Malloy, CPA</h2>
            <p className="text-slate-700 mb-4">
              Jack Malloy is a CPA licensed in California and an alumnus of Cal Poly State
              University. Working in public accounting since 2011, Jack has a wide variety of
              experience in the tax and accounting field.
            </p>
            <p className="text-slate-700 mb-6">
              Our family-owned practice is dedicated to serving individuals and small businesses
              with personalized attention and professional expertise.
            </p>

            <div className="space-y-3">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-sky-700 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-slate-700">CPA Licensed in California</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-sky-700 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-slate-700">Cal Poly State University Graduate</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-sky-700 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-slate-700">Public Accounting Experience Since 2011</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-sky-700 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-slate-700">Family-Owned Business</span>
              </div>
            </div>
          </div>

          <div className="bg-sky-50 p-8 rounded-lg border border-sky-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Our Commitment</h3>
            <blockquote className="text-slate-700 italic mb-4">
              &ldquo;We believe in building long-term relationships with our clients by providing
              personalized, professional service that you can trust. Every client receives the same
              attention to detail and commitment to excellence.&rdquo;
            </blockquote>
            <cite className="text-slate-600 not-italic">— Jack Malloy, CPA</cite>
          </div>
        </div>

        <div className="mt-16 bg-sky-100 p-8 rounded-lg border border-sky-200">
          <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center">
            Why Choose Malloy Accounting?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-slate-900 mb-2">Personal Service</h4>
              <p className="text-slate-700 text-sm">
                Direct access to your CPA with personalized attention to your unique needs.
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-slate-900 mb-2">Local Expertise</h4>
              <p className="text-slate-700 text-sm">
                Deep understanding business environments and tax regulations.
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-slate-900 mb-2">Proven Experience</h4>
              <p className="text-slate-700 text-sm">
                Over a decade of experience in public accounting and tax preparation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
