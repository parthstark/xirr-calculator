import { atom, selector, selectorFamily } from "recoil";
import { Stock } from "../types/types";
import { calculateXIRRPercentage } from './utils';
import { getStockHoldingsFromLocalStorage } from "./localStorage";

export const portfolioHoldingsAtom = atom<Stock[]>({
    key: "portfolioHoldingsAtom",
    default: selector({
        key: 'portfolioHoldingsAtom/DefaultSelector',
        get: async () => await getStockHoldingsFromLocalStorage()
    })
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

export const stockSelectorFamily = selectorFamily({
    key: "stockSelectorFamily",
    get: (stockName?: string) => ({ get }) => {
        const holdings = get(portfolioHoldingsAtom)
        return holdings.find(stock => stock.name === stockName)
    },
    set: (stockName?: string) => ({ set, get }, newValue) => {
        const holdings = get(portfolioHoldingsAtom);
        const stockIndex = holdings.findIndex(stock => stock.name === stockName);

        if (stockIndex !== -1) {
            // Stock found, update it
            const updatedHoldings = holdings.map((stock, index) =>
                index === stockIndex ? { ...stock, ...newValue } : stock
            );
            set(portfolioHoldingsAtom, updatedHoldings);
        } else {
            // Stock not found, add it
            const newStock: Stock = { ...newValue };
            set(portfolioHoldingsAtom, [...holdings, newStock]);
        }
    }
})

export const stockReturnsSelectorFamily = selectorFamily({
    key: "stockReturnsSelectorFamily",
    get: (stockName: string) => ({ get }) => {
        const stock = get(stockSelectorFamily(stockName))

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