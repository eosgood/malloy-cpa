import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PaymentApprovalEmailTemplate } from '@/components/email/PaymentApprovalEmailTemplate';
import { withProtection } from '@/app/lib/api/protect';
import React from 'react';
import { z } from 'zod';

// Make sure RESEND_API_KEY is set in your environment
const resend = new Resend(process.env.RESEND_API_KEY);

const PaymentApprovalRequest = z.object({
  invoiceId: z.string(),
  amount: z.number(),
  email: z.string().email(),
  responseJson: z.string(),
});

/**
 * POST /api/email/payment/approval
 * Sends a payment approval notification email
 */
export const POST = withProtection(async (req /* Request */, _ctx, { badRequest }) => {
  const requestId = Math.random().toString(36).substring(2, 10);
  const startTime = Date.now();

  console.log('[email/approval] Request received', {
    requestId,
    timestamp: new Date().toISOString(),
  });

  let raw: unknown;
  try {
    raw = await req.json();
  } catch (error) {
    console.error('[email/approval] Invalid JSON', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
    });
    return badRequest('Invalid JSON');
  }

  console.log('[email/approval] Parsing request body', {
    requestId,
    hasRaw: !!raw,
  });

  const parsedPaymentApprovalRequest = await PaymentApprovalRequest.safeParseAsync(raw);
  if (!parsedPaymentApprovalRequest.success) {
    console.error('[email/approval] Validation failed', {
      requestId,
      errors: parsedPaymentApprovalRequest.error.errors,
    });
    return badRequest('Invalid body');
  }

  const { invoiceId, amount, email, responseJson } = parsedPaymentApprovalRequest.data;

  console.log('[email/approval] Sending email', {
    requestId,
    invoiceId,
    amount,
    to: email,
    hasResponseJson: !!responseJson,
    responseJsonLength: responseJson?.length || 0,
  });

  try {
    const result = await resend.emails.send({
      to: email,
      from: 'onboarding@resend.dev', // Use Resend's test domain
      subject: `Payment Approval For Invoice ${invoiceId}`,
      react: React.createElement(PaymentApprovalEmailTemplate, {
        invoiceId,
        amount,
        email,
        responseJson,
      }),
    });

    if (result.error) {
      console.error('[email/approval] Resend API error', {
        requestId,
        error: result.error,
        durationMs: Date.now() - startTime,
      });
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    console.log('[email/approval] Email sent successfully', {
      requestId,
      emailId: result.data.id,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ success: true, id: result.data.id });
  } catch (error) {
    console.error('[email/approval] Unexpected error', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
});
