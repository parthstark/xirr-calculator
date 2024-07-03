export type Transaction = {
    txId: string | number[],
    dateOfPurchase: Date,
    quantity: number,
    buyingPrice: number
}

export type Stock = {
    name: string,
    currentPrice: number,
    transactions: Transaction[],
}