import uuid from 'react-native-uuid';
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { Stock } from "../types/types";
import { calculateXIRRPercentage } from './utils';

const teststocks: Stock[] = [
    {
        name: 'TATAMOTORS',
        currentPrice: 302.2399343,
        transactions: [{
            txId: uuid.v4(),
            quantity: 1000,
            buyingPrice: 195.61884,
            dateOfPurchase: new Date(2021, 12, 23),
        },]
    },
    {
        name: 'PAYTM',
        currentPrice: 890.44,
        transactions: [{
            txId: uuid.v4(),
            quantity: 20,
            buyingPrice: 2567,
            dateOfPurchase: new Date(2023, 4, 4),
        },]
    },
    {
        name: 'INFY',
        currentPrice: 1510.235,
        transactions: [{
            txId: uuid.v4(),
            quantity: 1250,
            buyingPrice: 499.01,
            dateOfPurchase: new Date(2020, 28, 3),
        },]
    }
]

const myStocks: Stock[] = [
    {
        name: 'NIFTYBEES',
        currentPrice: 270.23,
        transactions: [
            {
                txId: uuid.v4(),
                quantity: 300,
                buyingPrice: 250.30,
                dateOfPurchase: new Date(2024, 5, 4),
            }
        ]
    },
    {
        name: 'MIDCAPETF',
        currentPrice: 21.29,
        transactions: [{
            txId: uuid.v4(),
            quantity: 8000,
            buyingPrice: 18.62,
            dateOfPurchase: new Date(2024, 5, 4),
        },]
    }
]

export const portfolioHoldingsAtom = atom<Stock[]>({
    key: "portfolioHoldingsAtom",
    default: myStocks
})

export const portfolioReturnsSeclector = selector({
    key: "portfolioReturnsSeclector",
    get: ({ get }) => {
        const holdings = get(portfolioHoldingsAtom)
        let investedAmount = 0
        let currentAmount = 0
        holdings.forEach(stock => {
            stock.transactions.forEach(tx => {
                investedAmount += (tx.buyingPrice * tx.quantity);
                currentAmount += (stock.currentPrice * tx.quantity);
            })
        })
        const xirReturn = calculateXIRRPercentage(holdings);
        const absReturn = (currentAmount - investedAmount) / investedAmount * 100;
        return { investedAmount, currentAmount, xirReturn, absReturn }
    }
})

export const stockAtomFamily = atomFamily({
    key: "stockAtomFamily",
    default: (stockName?: string) => {
        return myStocks.find(stock => stock.name === stockName)
    }
})

export const stockSelectorFamily = selectorFamily({
    key: "stockSelectorFamily",
    get: (stockName: string) => () => {
        const stock = myStocks.find(stock => stock.name === stockName)

        let investedAmount = 0
        let currentAmount = 0
        let totalQuantity = 0
        stock?.transactions.forEach(tx => {
            investedAmount += (tx.buyingPrice * tx.quantity);
            currentAmount += (stock.currentPrice * tx.quantity);
            totalQuantity += tx.quantity;
        })
        const xirReturn = stock ? calculateXIRRPercentage([stock]) : NaN;
        const absReturn = (currentAmount - investedAmount) / investedAmount * 100;
        return { investedAmount, currentAmount, xirReturn, absReturn, totalQuantity }
    }
})