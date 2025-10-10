'use client';

// Helper: Check if running in client/browser
const isClient = () => typeof window !== 'undefined';

import { useState, useCallback } from 'react';
import type { CreateSessionResponse } from '@/types/elavon';

interface PaymentFormProps {
    invoiceNumber?: string;
    amount?: string;
}

export default function PaymentForm({ invoiceNumber, amount: initialAmount }: PaymentFormProps) {
    return null;
}
   