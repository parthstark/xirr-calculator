import { atom, DefaultValue, selector, selectorFamily } from "recoil";
import { Stock } from "../types/types";
import { calculateXIRRPercentage } from './utils';
import { getStocksFromLocalStorage, saveStocksToLocalStorage } from "./localStorage";

const portfolioHoldingsAtom = atom<Stock[]>({
    key: "portfolioHoldingsAtom",
    default: selector({
        key: 'portfolioHoldingsAtom/DefaultSelector',
        get: async () => await getStocksFromLocalStorage()
    })
})

export const portfolioHoldingsSelector = selector<Stock[]>({
    key: "portfolioHoldingsSelector",
    get: ({ get }) => get(portfolioHoldingsAtom),
    set: ({ set }, newValue) => {
        set(portfolioHoldingsAtom, newValue);
        if (!(newValue instanceof DefaultValue)) {
            saveStocksToLocalStorage(newValue);
        }
    },
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
            const updatedHoldings = holdings.map((stock, index) =>
                index === stockIndex ? { ...stock, ...newValue } : stock
            );
            set(portfolioHoldingsAtom, updatedHoldings);
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