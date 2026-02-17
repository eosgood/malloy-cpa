import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Row,
  Column,
} from '@react-email/components';

interface PaymentApprovalEmailTemplateProps {
  invoiceId: string;
  amount: number;
  email: string;
}

export const PaymentApprovalEmailTemplate: React.FC<PaymentApprovalEmailTemplateProps> = ({
  invoiceId,
  amount,
  email,
}) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return (
    <Html>
      <Head />
      <Preview>
        Payment of {formattedAmount} approved for invoice #{invoiceId}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Malloy Accounting LLC</Heading>
            <Text style={headerSubtitle}>Payment Confirmation</Text>
          </Section>

          {/* Success Banner */}
          <Section style={successBanner}>
            <Text style={successIcon}>✓</Text>
            <Heading style={successTitle}>Payment Approved</Heading>
            <Text style={successMessage}>Your payment has been successfully processed</Text>
          </Section>

          {/* Payment Details */}
          <Section style={detailsSection}>
            <Heading style={sectionHeading}>Payment Details</Heading>

            <Row style={detailRow}>
              <Column style={detailLabel}>Invoice Number:</Column>
              <Column style={detailValue}>#{invoiceId}</Column>
            </Row>

            <Row style={detailRow}>
              <Column style={detailLabel}>Amount Paid:</Column>
              <Column style={detailValueAmount}>{formattedAmount}</Column>
            </Row>

            <Row style={detailRow}>
              <Column style={detailLabel}>Payment Date:</Column>
              <Column style={detailValue}>{timestamp}</Column>
            </Row>

            <Row style={detailRow}>
              <Column style={detailLabel}>Email Address:</Column>
              <Column style={detailValue}>{email}</Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* What's Next */}
          <Section style={infoSection}>
            <Heading style={sectionHeading}>What Happens Next?</Heading>
            <Text style={paragraph}>
              Your payment has been received and applied to your account. You will receive a receipt
              for your records shortly.
            </Text>
            <Text style={paragraph}>
              If you have any questions about this payment or your invoice, please don&apos;t
              hesitate to contact us.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Malloy Accounting LLC</strong>
            </Text>
            <Text style={footerText}>5345 N. El Dorado St, Suite 4</Text>
            <Text style={footerText}>Stockton, CA 95207</Text>
            <Text style={footerText}>
              Phone:{' '}
              <a href="tel:2094251999" style={link}>
                (209) 425-1999
              </a>
            </Text>
            <Text style={footerText}>
              Email:{' '}
              <a href="mailto:jack@malloycpa.com" style={link}>
                jack@malloycpa.com
              </a>
            </Text>
            <Text style={footerTextSmall}>
              This is an automated message. Please do not reply directly to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const header = {
  backgroundColor: '#0c4a6e', // sky-900
  padding: '32px 24px',
  textAlign: 'center' as const,
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const headerSubtitle = {
  color: '#e0f2fe', // sky-100
  fontSize: '16px',
  margin: '0',
};

const successBanner = {
  backgroundColor: '#ecfdf5', // green-50
  padding: '32px 24px',
  textAlign: 'center' as const,
  borderBottom: '4px solid #10b981', // green-500
};

const successIcon = {
  fontSize: '48px',
  margin: '0',
  color: '#10b981',
};

const successTitle = {
  color: '#065f46', // green-900
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '8px 0',
};

const successMessage = {
  color: '#047857', // green-700
  fontSize: '16px',
  margin: '0',
};

const detailsSection = {
  padding: '32px 24px',
};

const infoSection = {
  padding: '24px',
};

const sectionHeading = {
  color: '#1e293b', // slate-900
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const detailRow = {
  marginBottom: '12px',
};

const detailLabel = {
  color: '#64748b', // slate-500
  fontSize: '14px',
  fontWeight: '500',
  paddingRight: '16px',
  width: '40%',
};

const detailValue = {
  color: '#334155', // slate-700
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const detailValueAmount = {
  color: '#0c4a6e', // sky-900
  fontSize: '18px',
  fontWeight: 'bold',
  width: '60%',
};

const paragraph = {
  color: '#475569', // slate-600
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 12px 0',
};

const divider = {
  borderColor: '#e2e8f0', // slate-200
  margin: '0',
};

const footer = {
  backgroundColor: '#f8fafc', // slate-50
  padding: '24px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#64748b', // slate-500
  fontSize: '14px',
  margin: '4px 0',
};

const footerTextSmall = {
  color: '#94a3b8', // slate-400
  fontSize: '12px',
  margin: '16px 0 0 0',
  fontStyle: 'italic',
};

const link = {
  color: '#0284c7', // sky-600
  textDecoration: 'none',
};

export default PaymentApprovalEmailTemplate;
