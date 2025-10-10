import PaymentForm from '@/components/PaymentForm';
import { notFound } from 'next/navigation';

interface InvoicePaymentPageProps {
  params: Promise<{
    invoice: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InvoicePaymentPage(props: InvoicePaymentPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { invoice } = params;
  // Get amount from query string if present
  let amount: string | undefined = undefined;
  if (searchParams && typeof searchParams.amount === 'string') {
    amount = searchParams.amount;
  }

  // Basic validation for invoice parameter
  if (!invoice || invoice.length < 3) {
    notFound();
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pay Invoice</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-xl text-blue-800">
              <strong>Invoice #:</strong> {invoice}
            </p>
          </div>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Please review your invoice details and complete your payment securely below.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Invoice Payment</h2>
              <div className="space-y-3 text-gray-700">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Paying Invoice:</p>
                  <p className="text-lg font-semibold text-gray-900">#{invoice}</p>
                </div>

                <div className="mt-6">
                  <p>
                    <strong>Accepted Payment Methods:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Visa, Mastercard, American Express, Discover</li>
                    <li>Debit Cards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Questions About This Invoice?
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+1234567890" className="text-blue-600 hover:underline">
                    (123) 456-7890
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:billing@malloycpa.com" className="text-blue-600 hover:underline">
                    billing@malloycpa.com
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  Please reference invoice #{invoice} when contacting our office about this payment
                  or any billing questions.
                </p>
              </div>
            </div>
          </div>

          <PaymentForm invoiceNumber={invoice} amount={amount} />
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            <strong>Secure Payment:</strong> All transactions are encrypted and processed securely
            through Elavon/Converge.
          </p>
        </div>
      </div>
    </div>
  );
}
