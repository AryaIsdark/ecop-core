import { OrderLineStatus } from "../entities"

export class CreateOrderLineDto {
    orderId: number
    clientId: number
    product_sku : string
    product_ean: string
    quantity: number
    originalCreatedAt: Date
    status: OrderLineStatus
}
