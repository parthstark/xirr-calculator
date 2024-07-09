export type Transaction = {
    txId: string | number[],
    dateOfPurchaseMsEpoch: number,
    quantity: number,
    buyingPrice: number
}

export type Stock = {
    name: string,
    currentPrice: number,
    transactions: Transaction[],
}