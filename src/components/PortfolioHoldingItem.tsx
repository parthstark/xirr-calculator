import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stock } from '../types/types';
import { getTailwindColorClassOnPriceComparison, calculateXIRRPercentage, splitNumberToIntAndDecimal } from '../utils/utils';
import Divider from './common/Divider';

interface PortfolioHoldingItem {
    stock: Stock,
    onPress: () => void,
}

const PortfolioHoldingItem = ({ stock, onPress }: PortfolioHoldingItem) => {

    let investedAmount = 0
    let currentAmount = 0
    let totalQuantity = 0
    stock.transactions.forEach(tx => {
        investedAmount += (tx.buyingPrice * tx.quantity);
        currentAmount += (stock.currentPrice * tx.quantity);
        totalQuantity += tx.quantity;
    })
    const xirReturn = calculateXIRRPercentage([stock]);
    const absReturn = (currentAmount - investedAmount) / investedAmount * 100;

    const [investedInt, investedDecimal] = splitNumberToIntAndDecimal(investedAmount)
    const [currentInt, currentDecimal] = splitNumberToIntAndDecimal(currentAmount)
    const [absReturnInt, absReturnDecimal] = splitNumberToIntAndDecimal(absReturn)
    const [xirReturnInt, xirReturnDecimal] = splitNumberToIntAndDecimal(xirReturn)

    const displayColor = getTailwindColorClassOnPriceComparison(investedAmount, currentAmount);

    return (
        <TouchableOpacity onPress={onPress} className='flex-col mt-5'>
            <View className='flex-row justify-between'>
                <View className='flex-[1.5] flex-col items-start justify-end'>
                    <Text className='text-xl font-light text-black dark:text-white'>
                        {stock.name}
                    </Text>
                </View>
                <View className='flex-1 flex-col items-center justify-end'>
                    <Text className={'text-2xl ' + displayColor}>
                        {xirReturnInt + '.'}
                        <Text className='text-xl'>{xirReturnDecimal}</Text>
                        <Text className='text-base'>%</Text>
                    </Text>
                </View>
                <View className='flex-1 flex-col items-end justify-end'>
                    <Text className={'text-lg font-light ' + displayColor}>
                        {currentInt + '.'}
                        <Text className='text-sm'>{currentDecimal}</Text>
                    </Text>
                </View>
            </View>
            <View className='flex-row justify-between'>
                <View className='flex-[1.5] flex-col items-start justify-end'>
                    <Text className='text-base font-light text-gray-500 dark:text-gray-50'>
                        {totalQuantity}
                    </Text>
                </View>
                <View className='flex-1 flex-col items-center justify-end'>
                    <Text className={'text-lg ' + displayColor}>
                        {absReturnInt + '.'}
                        <Text className='text-base'>{absReturnDecimal}</Text>
                        <Text className='text-xs'>%</Text>
                    </Text>
                </View>
                <View className='flex-1 flex-col items-end justify-end'>
                    <Text className='text-lg font-light text-gray-500 dark:text-gray-50'>
                        {investedInt + '.'}
                        <Text className='text-sm'>{investedDecimal}</Text>
                    </Text>
                </View>
            </View>
            <Divider />
        </TouchableOpacity>
    )
}

export default PortfolioHoldingItem