export type Transaction = {
    txId: string | number[],
    dateOfPurchaseMsEpoch: number,
    quantity: number,
    buyingPrice: number
}

export type Stock = {
    name: string,
    currentPrice: string,
    transactions: Transaction[],
}