import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PaymentApprovalEmailTemplate } from '@/components/email/PaymentApprovalEmailTemplate';
import React from 'react';

// Make sure RESEND_API_KEY is set in your environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the expected request body type
interface PaymentApprovedEmailRequest {
  invoiceId: string;
  amount: number;
  email: string;
  responseJson: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PaymentApprovedEmailRequest;
    const { invoiceId, amount, email, responseJson } = body;

    const result = await resend.emails.send({
      to: 'eric@ericosgood.com',
      from: 'noreply@malloycpa.com',
      subject: `Payment Approval For Invoice ${invoiceId}`,
      react: React.createElement(PaymentApprovalEmailTemplate, {
        invoiceId,
        amount,
        email,
        responseJson,
      }),
    });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.data.id });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
