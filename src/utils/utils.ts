import { Stock } from "../types/types";
var xirr = require('xirr');

export const calculateXIRRPercentage = (stocks: Stock[]): number => {
    const xirrArray: { amount: number, when: Date }[] = []

    // generate buys
    stocks.forEach(stock => {
        xirrArray.push({
            amount: stock.buyingPrice * stock.quantity * -1,
            when: stock.dateOfPurchase
        })
    });

    // generate current value
    stocks.forEach(stock => {
        xirrArray.push({
            amount: stock.currentPrice * stock.quantity,
            when: new Date()
        })
    });

    return xirr(xirrArray) * 100;
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