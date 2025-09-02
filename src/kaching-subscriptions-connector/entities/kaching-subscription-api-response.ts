export type KachingSubscriptionContract = {
  contractId: string;
  subscriptionContractStatus: string;
  upcomingBillingCycles: KachingUpcomingBillingCycle[];
};

export type KachingUpcomingBillingCycle = {
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
};

export type KachingSubscriptionBillingCyclesApiResponse = {
  result: KachingSubscriptionContract[];
  hasNextPage: boolean;
  cursor: string;
};
