import { Platform } from "react-native";
import { Stock } from "../types/types";
var xirr = require('xirr');

export const calculateXIRRPercentage = (stocks: Stock[]): number => {
    if (stocks.length === 0) {
        return NaN;
    }

    const xirrArray: { amount: number, when: Date }[] = []

    // generate buys
    stocks.forEach(stock => {
        stock.transactions.forEach(tx => {
            xirrArray.push({
                amount: tx.buyingPrice * tx.quantity * -1,
                when: new Date(tx.dateOfPurchaseMsEpoch)
            })
        })
    });

    // generate current value
    stocks.forEach(stock => {
        stock.transactions.forEach(tx => {
            xirrArray.push({
                amount: parseFloat(stock.currentPrice) * tx.quantity,
                when: new Date()
            })
        })
    });

    try {
        return xirr(xirrArray) * 100;
    } catch (_) {
        return NaN
    }
}

export const splitNumberToIntAndDecimal = (val: number): [string, string] => {
    let [int, decimal] = val.toFixed(2).toString().split('.');
    if (!decimal) decimal = '00';

    return [formatNumberWithCommas(int), decimal];
}

// chatgpt code
export const formatNumberWithCommas = (numberString: string): string => {
    let lastThreeDigits = numberString.slice(-3);
    let otherDigits = numberString.slice(0, -3);

    if (otherDigits !== '') {
        lastThreeDigits = ',' + lastThreeDigits;
    }

    const regex = /(\d+)(\d{2})/;
    while (regex.test(otherDigits)) {
        otherDigits = otherDigits.replace(regex, '$1,$2');
    }

    return otherDigits + lastThreeDigits;
}

export const getTailwindColorClassOnPriceComparison = (initialPrice: number, finalPrice: number): string => {
    if (finalPrice > initialPrice) {
        return 'text-green-600 dark:text-green-400';
    } else if (finalPrice < initialPrice) {
        return 'text-red-600 dark:text-red-400';
    }
    return 'text-black dark:text-white';
}

export const isIos = (): boolean => Platform.OS === 'ios';
export const isAndroid = (): boolean => Platform.OS === 'android';