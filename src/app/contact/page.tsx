import Hero from '@/components/Hero';

export default function Contact() {
  return (
    <div className="bg-white">
      <Hero
        title="Contact Malloy Accounting LLC"
        subtitle="Get in touch with our professional CPA team. We're here to help with all your tax and accounting needs."
      />

      <div className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Get In Touch</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Address */}
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-sky-600 mr-4 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-slate-900">Office Address</h3>
              <p className="text-slate-700">5345 N. El Dorado St, Suite 4</p>
              <p className="text-slate-700">Stockton, CA 95207</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-sky-600 mr-4 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-slate-900">Phone</h3>
              <a
                href="tel:2094251999"
                className="text-sky-600 hover:text-sky-800 transition-colors"
              >
                (209) 425-1999
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-sky-600 mr-4 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-slate-900">Email</h3>
              <a
                href="mailto:jack@malloycpa.com"
                className="text-sky-600 hover:text-sky-800 transition-colors"
              >
                jack@malloycpa.com
              </a>
            </div>
          </div>

          {/* Fax */}
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-sky-600 mr-4 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-slate-900">Fax</h3>
              <p className="text-slate-700">(209) 337-3323</p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-12 p-6 bg-sky-50 rounded-lg border border-sky-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Hours</h3>
          <div className="space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span>Monday - Friday</span>
              <span>9:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Saturday</span>
              <span>By Appointment</span>
            </div>
            <div className="flex justify-between">
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
