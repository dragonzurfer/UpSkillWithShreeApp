declare module '@cashfreepayments/cashfree-js' {
  export type CashfreeConfig = {
    mode: 'sandbox' | 'production';
    apiKey?: string;
  };

  export type CashfreePayment = {
    session: {
      token: string;
      id: string;
    };
  };

  export interface Cashfree {
    checkout: (
      options: {
        paymentSessionId: string;
      }
    ) => void;
  }

  export function load(config: CashfreeConfig): Promise<Cashfree>;
} 