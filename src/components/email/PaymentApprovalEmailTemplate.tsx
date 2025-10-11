import * as React from 'react';

interface PaymentApprovalEmailTemplateProps {
  invoiceId: string;
  amount: number;
  email: string;
  responseJson: string;
}

export const PaymentApprovalEmailTemplate: React.FC<PaymentApprovalEmailTemplateProps> = ({
  invoiceId,
  amount,
  email,
}) => {
  return (
    <div>
      <h1>Payment Approval for invoice {invoiceId}</h1>
      <p>
        {email} has approved a payment of ${amount} for invoice {invoiceId}.
      </p>
    </div>
  );
};

export default PaymentApprovalEmailTemplate;
