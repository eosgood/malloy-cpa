export default function Services() {
  const services = [
    {
      title: 'Tax Return Preparation',
      icon: (
        <svg
          className="w-12 h-12 text-slate-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      description:
        'Accurate and timely preparation of individual and business tax returns with expertise in navigating complex tax codes.',
      features: [
        'Individual Tax Returns (Form 1040)',
        'Business Tax Returns (1120, 1120S, 1065)',
        'Complex Tax Code Navigation',
        'Maximize Deductions and Credits',
        'Current Regulation Compliance',
      ],
    },
    {
      title: 'Tax Planning',
      icon: (
        <svg
          className="w-12 h-12 text-slate-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      description:
        'Strategic tax planning to minimize liabilities and optimize financial outcomes for individuals and businesses.',
      features: [
        'Year-Round Tax Consultation',
        'Strategic Tax Minimization',
        'Financial Decision Analysis',
        'Current and Future Tax Planning',
        'Proactive Tax Strategies',
      ],
    },
    {
      title: 'Small Business Services',
      icon: (
        <svg
          className="w-12 h-12 text-slate-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h.01M7 3h.01"
          />
        </svg>
      ),
      description:
        'Specialized services for small businesses including sole proprietors, partnerships, and LLCs.',
      features: [
        'Business Structure Guidance',
        'Small Business Tax Returns',
        'Deduction Optimization',
        'Compliance Assistance',
        'Tax-Efficient Business Strategies',
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sky-50 to-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-slate-600 mb-6">Professional CPA Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive accounting and tax services tailored to meet the unique needs of
            individuals and small businesses.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="space-y-16">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-4">
                    {service.icon}
                    <h2 className="text-2xl font-bold text-gray-900 ml-4">{service.title}</h2>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
                  <div className="flex justify-start">
                    <a
                      href="/contact"
                      className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What&rsquo;s Included:
                  </h3>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
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
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-sky-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
            Contact Malloy Accounting LLC today to discuss your tax and accounting needs.
            We&rsquo;re here to help you achieve your financial goals.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <a
              href="/contact"
              className="inline-block bg-white text-slate-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
            >
              Contact Us Today
            </a>
            <a
              href="tel:2094251999"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-slate-600 font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
            >
              Call (209) 425-1999
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
