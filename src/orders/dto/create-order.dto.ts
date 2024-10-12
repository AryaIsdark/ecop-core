import { OrderLine } from "src/order-lines"
import { OrderStatus } from "../entities"

export class CreateOrderDto {
    clientId: number
    reference: string
    totalAmount: number
    status: OrderStatus
    originalCreatedAt: Date
    lineItems : Partial<OrderLine>[]
}
