import { SubscriptionType } from "./entities/subscription.entity"

export type SubscriptionConfig = {
    type: SubscriptionType,
    numberOfUsers: number
    numberOfSuppliers: number
    numberOfJobRuns: number
    numberOfPurchaseOrders: number
    hasAiFeatures: boolean
    hasPimFeatures: boolean
}

const subscriptions: SubscriptionConfig[] = [{
    type: SubscriptionType.TRIAL,
    numberOfUsers: 1,
    numberOfSuppliers: 1,
    numberOfJobRuns: 5,
    numberOfPurchaseOrders: 1,
    hasPimFeatures: false,
    hasAiFeatures: false
},
{
    type: SubscriptionType.BASIC,
    numberOfUsers: 1,
    numberOfSuppliers: 2,
    numberOfJobRuns: 10,
    numberOfPurchaseOrders: 3,
    hasPimFeatures: true,
    hasAiFeatures: false
}, {
    type: SubscriptionType.PRO,
    numberOfUsers: 1,
    numberOfSuppliers: 999999,
    numberOfJobRuns: 999999,
    numberOfPurchaseOrders: 999999,
    hasPimFeatures: true,
    hasAiFeatures: true
}
]

export const getSubscriptionConfig = (type: SubscriptionType) => subscriptions.find((s) => s.type === type)