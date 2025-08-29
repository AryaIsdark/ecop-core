export type KachinSubscriptionApiResponse = {
    contractId: string;
    subscriptionContractStatus: string;
    upcomingBillingCycles: Array<{
      billingAttemptExpectedDate: string;
      cycleIndex: number;
      skipped: boolean;
      sourceContract: {
        deliveryPolicy: {
          interval: string;
          intervalCount: number;
        };
        lines: {
          nodes: Array<{
            id: string;
            productId: string;
            variantId: string;
            title: string;
            variantTitle: string | null;
            currentPrice: { amount: string; currencyCode: string };
            quantity: number;
            sku: string;
          }>;
        };
      };
    }>;
  };
  