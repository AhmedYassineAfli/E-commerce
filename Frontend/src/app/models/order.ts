export interface Order {
    id?: number;
    userId: number;
    orderItems: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    orderDate?: string;
    deliveryAddress: string;
    deliveryPhone: string;
    deliveryName: string;
    notes?: string;
    reported?: boolean;
    signal?: Signal;
}

export interface Signal {
    id: number;
    reason: string;
    image: string;
    reportDate: string;
}

export interface OrderItem {
    id?: number;
    productId?: number;
    product?: any;
    quantity: number;
    price: number;
    subtotal?: number;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
    CREDIT_CARD = 'CREDIT_CARD',
    PAYPAL = 'PAYPAL'
}

export interface CreateOrderRequest {
    userId: number;
    items: {
        productId: number;
        quantity: number;
    }[];
    orderInfo: {
        paymentMethod: string;
        deliveryAddress: string;
        deliveryPhone: string;
        deliveryName: string;
        notes?: string;
    };
}
