import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Compiler optimizations for modern browsers
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Performance optimizations
  poweredByHeader: false,

  // Security headers
  async headers() {
    // Converge domains needed for payment lightbox
    const convergeDomains = 'https://api.convergepay.com https://demo.convergepay.com';

    // Build Content-Security-Policy directives
    const csp = [
      `default-src 'self'`,
      // 'unsafe-inline' required: Next.js injects inline <script> tags for hydration/chunks;
      // nonce-based CSP would require custom middleware — this is still a major uplift from no CSP.
      `script-src 'self' 'unsafe-inline' https://code.jquery.com ${convergeDomains} https://va.vercel-scripts.com`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: blob:`,
      `font-src 'self'`,
      `connect-src 'self' ${convergeDomains} https://vitals.vercel-insights.com`,
      `frame-src ${convergeDomains}`,
      `frame-ancestors 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `object-src 'none'`,
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            // Modern browsers use CSP frame-ancestors instead; legacy header set to 0
            // to avoid re-enabling flawed XSS auditors.
            key: 'X-XSS-Protection',
            value: '0',
          },
          {
            // Enforce HTTPS for 1 year, include subdomains, allow HSTS preload list
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
