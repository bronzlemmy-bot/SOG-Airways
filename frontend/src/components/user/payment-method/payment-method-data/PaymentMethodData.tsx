"use client";

export type PaymentMethodType = "visa" | "mastercard" | "amex";

export interface PaymentMethod {
id: string;
type: PaymentMethodType;
brand: string;
lastFour: string;
expiryMonth: string;
expiryYear: string;
cardholderName: string;
isDefault: boolean;
demoOnly: true;
}

export const paymentMethods: PaymentMethod[] = [
{
id: "pm-001",
type: "visa",
brand: "Visa",
lastFour: "4242",
expiryMonth: "08",
expiryYear: "2028",
cardholderName: "SOG AIRWAYS",
isDefault: true,
demoOnly: true,
},
{
id: "pm-002",
type: "mastercard",
brand: "Mastercard",
lastFour: "8210",
expiryMonth: "11",
expiryYear: "2027",
cardholderName: "SOG AIRWAYS",
isDefault: false,
demoOnly: true,
},
{
id: "pm-003",
type: "amex",
brand: "American Express",
lastFour: "1005",
expiryMonth: "04",
expiryYear: "2029",
cardholderName: "SOG AIRWAYS",
isDefault: false,
demoOnly: true,
},
];
