import Hero from '@/components/Hero';

export default function Contact() {
  const contactItems = [
    {
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
      title: 'Office Address',
      content: ['5345 N. El Dorado St, Suite 4', 'Stockton, CA 95207'],
      link: null,
    },
    {
      icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
      title: 'Phone',
      content: ['(209) 425-1999'],
      link: { href: 'tel:2094251999', type: 'phone' },
    },
    {
      icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      title: 'Email',
      content: ['jack@malloycpa.com'],
      link: { href: 'mailto:jack@malloycpa.com', type: 'email' },
    },
    {
      icon: 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z',
      title: 'Fax',
      content: ['(209) 337-3323'],
      link: null,
    },
  ];

  return (
    <div className="bg-white">
      <Hero
        title="Contact Malloy Accounting LLC"
        subtitle="Get in touch with our professional CPA team. We're here to help with all your tax and accounting needs."
      />

      <div className="max-w-4xl mx-auto py-16 px-6">
        {/* Contact Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactItems.map((item, index) => (
            <div
              key={index}
              className="bg-sky-50 border border-sky-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-sky-100">
                    <svg
                      className="w-6 h-6 text-sky-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={item.icon}
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <div className="space-y-1">
                    {item.content.map((line, i) => {
                      if (item.link && i === 0) {
                        return (
                          <a
                            key={i}
                            href={item.link.href}
                            className="text-sky-600 hover:text-sky-800 font-medium transition-colors block"
                          >
                            {line}
                          </a>
                        );
                      }
                      return (
                        <p key={i} className="text-slate-700">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Business Hours Section */}
        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Business Hours</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Weekdays</h3>
              <p className="text-slate-700">Monday - Friday</p>
              <p className="text-lg font-semibold text-sky-700">9:00 AM - 5:00 PM</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Saturday</h3>
              <p className="text-slate-700">By Appointment</p>
              <p className="text-lg font-semibold text-sky-700">Contact for details</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Sunday</h3>
              <p className="text-slate-700">Closed</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-sky-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Work Together?</h2>
          <p className="text-sky-50 mb-6 max-w-2xl mx-auto">
            Reach out today to schedule a consultation with our CPA team and discover how we can
            support your financial goals.
          </p>
          <a
            href="tel:2094251999"
            className="inline-block bg-white text-sky-600 hover:bg-sky-50 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Call Now: (209) 425-1999
          </a>
        </div>
      </div>
    </div>
  );
}
