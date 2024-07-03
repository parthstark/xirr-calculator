import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stock } from '../types/types';
import { getTailwindColorClassOnPriceComparison, calculateXIRRPercentage, splitNumberToIntAndDecimal } from '../utils/utils';
import Divider from './common/Divider';

interface PortfolioHoldingItem {
    stock: Stock
}

const PortfolioHoldingItem = ({ stock }: PortfolioHoldingItem) => {

    const displayColor = getTailwindColorClassOnPriceComparison(stock.buyingPrice, stock.currentPrice)

    const absReturn = (stock.currentPrice - stock.buyingPrice) / stock.buyingPrice * 100;
    const xirReturn = calculateXIRRPercentage([stock])

    const [buyingPriceInt, buyingPriceDecimal] = splitNumberToIntAndDecimal(stock.buyingPrice)
    const [currentPriceInt, currentPriceDecimal] = splitNumberToIntAndDecimal(stock.currentPrice)
    const [absReturnInt, absReturnDecimal] = splitNumberToIntAndDecimal(absReturn)
    const [xirReturnInt, xirReturnDecimal] = splitNumberToIntAndDecimal(xirReturn)

    return (
        <TouchableOpacity className='flex-col mt-5'>
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
                        {currentPriceInt + '.'}
                        <Text className='text-sm'>{currentPriceDecimal}</Text>
                    </Text>
                </View>
            </View>
            <View className='flex-row justify-between'>
                <View className='flex-[1.5] flex-col items-start justify-end'>
                    <Text className='text-base font-light text-gray-500 dark:text-gray-50'>
                        {stock.quantity}
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
                        {buyingPriceInt + '.'}
                        <Text className='text-sm'>{buyingPriceDecimal}</Text>
                    </Text>
                </View>
            </View>
            <Divider />
        </TouchableOpacity>
    )
}

export default PortfolioHoldingItem