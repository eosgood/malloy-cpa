export interface CreateSessionResponse {
  success: boolean;
  token?: string;
  error?: string;
  errorCode?: string;
}

export interface PaymentFormData {
  amount: string;
  description: string;
  clientName: string;
  clientEmail: string;
  invoiceNumber?: string;
}

export interface ConvergePaymentData {
  ssl_account_id: string;
  ssl_user_id: string;
  ssl_pin: string;
  ssl_transaction_type: string;
  ssl_amount?: string;
  ssl_description?: string;
  ssl_invoice_number?: string;
  ssl_customer_code?: string;
  ssl_email?: string;
}

export interface PaymentSessionRequest {
  amount: number;
  description: string;
  invoiceNumber?: string;
  customerEmail?: string;
}