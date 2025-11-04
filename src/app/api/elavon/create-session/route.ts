// Type for expected payment request body
import { NextResponse } from 'next/server';
import { getConvergeEnv, getConvergeApiBaseUrl } from '@/config/converge';
import { withProtection } from '@/app/lib/api/protect';
import { z } from 'zod';

// Configuration constants
const VERCEL_PROXY_URL = process.env.VERCEL_PROXY_API_URL;

// Validation helper
const validateConfiguration = (accountId: string, userId: string, pin: string): string | null => {
  if (!accountId) return 'Missing Elavon Account ID';
  if (!userId) return 'Missing Elavon User ID';
  if (!pin) return 'Missing Elavon PIN';
  if (!VERCEL_PROXY_URL) return 'Missing Proxy URL';
  return null;
};

type ConvergeAuthParams = {
  ssl_merchant_id: string | undefined;
  ssl_user_id: string | undefined;
  ssl_pin: string | undefined;
};

const getConvergeAuthParams = (): ConvergeAuthParams => {
  switch (getConvergeEnv()) {
    case 'prod':
      return {
        ssl_merchant_id: process.env.ELAVON_ACCOUNT_ID,
        ssl_user_id: process.env.ELAVON_USER_ID,
        ssl_pin: process.env.ELAVON_PIN,
      };
    case 'demo':
      return {
        ssl_merchant_id: process.env.ELAVON_DEMO_ACCOUNT_ID,
        ssl_user_id: process.env.ELAVON_DEMO_USER_ID,
        ssl_pin: process.env.ELAVON_DEMO_PIN,
      };
  }
};

const Body = z.object({
  amount: z.number().int().positive(),
  invoiceNumber: z.string(),
});

/**
 * POST /api/elavon/create-session
 * Gets a Converge transaction token for lightbox payment
 * Called by frontend payment form to get token for PayWithConverge.open()
 */
export const POST = withProtection(async (req /* Request */, _ctx, { badRequest }) => {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return badRequest('Invalid JSON');
  }

  const startTime = Date.now();

  const convergeAuthParams = getConvergeAuthParams();

  try {
    console.log('Getting Converge transaction token for Malloy CPA');
    console.log('Environment check:', {
      hasAccountId: !!convergeAuthParams.ssl_merchant_id,
      hasUserId: !!convergeAuthParams.ssl_user_id,
      hasPin: !!convergeAuthParams.ssl_pin,
      hasProxyUrl: !!VERCEL_PROXY_URL,
      hasApiKey: !!process.env.VERCEL_API_KEY,
      hasBypass: !!process.env.VERCEL_PROTECTION_BYPASS,
    });

    // Get environment variables for Malloy CPA Elavon account
    const accountId = convergeAuthParams.ssl_merchant_id;
    const userId = convergeAuthParams.ssl_user_id;
    const pin = convergeAuthParams.ssl_pin;
    const apiKey = process.env.VERCEL_API_KEY;
    const protectionBypass = process.env.VERCEL_PROTECTION_BYPASS;

    // Check if environment variables exist
    if (!accountId || !userId || !pin || !apiKey || !protectionBypass || !VERCEL_PROXY_URL) {
      const missingSecrets = [];
      if (!accountId) missingSecrets.push('ELAVON_ACCOUNT_ID');
      if (!userId) missingSecrets.push('ELAVON_USER_ID');
      if (!pin) missingSecrets.push('ELAVON_PIN');
      if (!apiKey) missingSecrets.push('VERCEL_API_KEY');
      if (!protectionBypass) missingSecrets.push('VERCEL_PROTECTION_BYPASS');
      if (!VERCEL_PROXY_URL) missingSecrets.push('VERCEL_PROXY_API_URL');

      const error = `Missing required environment variables: ${missingSecrets.join(', ')}`;
      console.error('Environment configuration error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Payment system configuration error',
          errorCode: 'MISSING_SECRETS',
        },
        { status: 500 }
      );
    }

    // Validate configuration
    const configError = validateConfiguration(accountId, userId, pin);
    if (configError) {
      console.error('Configuration error:', configError);
      return NextResponse.json(
        {
          success: false,
          error: 'Payment system configuration error',
          errorCode: 'CONFIG_ERROR',
        },
        { status: 500 }
      );
    }

    // Parse request body for payment details
    const parsed = await Body.safeParseAsync(raw);
    if (!parsed.success) {
      return badRequest('Invalid body');
    }
    const { amount, invoiceNumber } = parsed.data;
    console.log('Payment request received:', {
      amount: amount,
      invoiceNumber: invoiceNumber,
    });

    // Prepare request data for Converge token request with payment details
    const formDataEntries: Record<string, string> = {
      ssl_account_id: accountId,
      ssl_user_id: userId,
      ssl_pin: pin,
      ssl_transaction_type: 'ccsale',
      // Include payment details in token request
      ...(typeof amount === 'number' && amount > 0 ? { ssl_amount: amount.toString() } : {}),
      ...(invoiceNumber ? { ssl_invoice_number: invoiceNumber } : {}),
    };

    const tokenFormData = new URLSearchParams(formDataEntries);

    // Build request URL using Vercel proxy
    const convergeTokenEndpoint = `${getConvergeApiBaseUrl()}/hosted-payments/transaction_token`;
    const tokenProxyUrl = `${VERCEL_PROXY_URL}?url=${encodeURIComponent(convergeTokenEndpoint)}`;

    console.log('Requesting Converge transaction token', {
      endpoint: convergeTokenEndpoint,
      proxy: tokenProxyUrl.substring(0, 100) + '...', // Don't log full URL
    });

    // Make API call to Converge via proxy
    const response = await fetch(tokenProxyUrl, {
      method: 'POST',
      headers: {
        'x-vercel-protection-bypass': protectionBypass,
        'X-API-Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenFormData.toString(),
    });

    const responseTime = Date.now() - startTime;
    console.log('Token response received', { status: response.status, time: responseTime });

    // Handle error responses
    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
        console.error('Converge API error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorBody.substring(0, 200), // Limit log size
        });
      } catch {
        console.error('Could not read error response body');
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Payment system temporarily unavailable. Please try again.',
          errorCode: `HTTP_${response.status}`,
        },
        { status: 500 }
      );
    }

    // Parse and validate token response
    const token = await response.text();
    const trimmedToken = token?.trim();

    if (!trimmedToken || trimmedToken.length === 0) {
      console.error('Empty or invalid token received');
      return NextResponse.json(
        {
          success: false,
          error: 'Payment system error. Please try again.',
          errorCode: 'EMPTY_TOKEN',
        },
        { status: 500 }
      );
    }

    // Validate token format (basic check)
    if (
      trimmedToken.length < 10 ||
      trimmedToken.includes('error') ||
      trimmedToken.includes('Error')
    ) {
      console.error('Invalid token format:', trimmedToken.substring(0, 50));
      return NextResponse.json(
        {
          success: false,
          error: 'Payment system error. Please try again.',
          errorCode: 'INVALID_TOKEN',
        },
        { status: 500 }
      );
    }

    console.log('Successfully received Converge token', {
      tokenLength: trimmedToken.length,
      responseTime,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      token: trimmedToken,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('Failed to get Converge token', {
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Payment system temporarily unavailable. Please try again.',
        errorCode: 'NETWORK_ERROR',
      },
      { status: 500 }
    );
  }
});
