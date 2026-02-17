import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Malloy Accounting LLC</h3>
            <p className="text-slate-300 mb-4">
              Family-owned tax practice servicing individuals and small businesses
            </p>
            <p className="text-slate-300 text-sm">CPA licensed in California</p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
            <div className="space-y-2 text-slate-300">
              <div>
                <p className="font-medium">Address:</p>
                <p>5345 N. El Dorado St, Suite 4</p>
                <p>Stockton, CA 95207</p>
              </div>
              <div>
                <p className="font-medium">Phone:</p>
                <a href="tel:+12094251999" className="hover:text-white transition-colors">
                  (209) 425-1999
                </a>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <a href="mailto:jack@malloycpa.com" className="hover:text-white transition-colors">
                  jack@malloycpa.com
                </a>
              </div>
              <div>
                <p className="font-medium">Fax:</p>
                <p>(209) 337-3323</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link
                href="/about"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/services"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/payment"
                className="block text-slate-300 hover:text-white transition-colors"
              >
                Payment
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {currentYear} Malloy Accounting LLC. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-slate-400 text-sm">
                Professional CPA Services | Stockton, California
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
