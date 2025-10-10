import { Suspense } from 'react';
import PaymentCompleteContent from './PaymentCompleteContent';

export default function PaymentCompletePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentCompleteContent />
    </Suspense>
  );
}
