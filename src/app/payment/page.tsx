import PaymentForm from '@/components/PaymentForm';

export default function PaymentPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Payment</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Securely pay for services, consultations, and retainer fees using our online payment
            system.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Accepted Payment Methods:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Visa, Mastercard, American Express, Discover</li>
                  <li>Debit Cards</li>
                </ul>
                <div className="mt-6">
                  <p>
                    <strong>Secure Payment Processing:</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    All payments are processed securely through Elavon/Converge. Your payment
                    information is encrypted and protected.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Need Help?</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+1234567890" className="text-sky-600 hover:underline">
                    (123) 456-7890
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:payments@malloycpa.com" className="text-sky-600 hover:underline">
                    payments@malloycpa.com
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  If you have questions about your invoice or payment, please contact our office
                  during business hours.
                </p>
              </div>
            </div>
          </div>

          <PaymentForm />
        </div>
      </div>
    </div>
  );
}
