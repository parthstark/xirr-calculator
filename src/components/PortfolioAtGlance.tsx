import { View, Text } from 'react-native'
import React from 'react'
import { Stock } from '../types/types'
import { calculateXIRRPercentage, splitNumberToIntAndDecimal, getTailwindColorClassOnPriceComparison } from '../utils/utils'

interface PortfolioAtGlanceProps {
    stocks: Stock[]
}

const PortfolioAtGlance = ({ stocks }: PortfolioAtGlanceProps) => {

    let investedAmount = 0
    let currentAmount = 0
    stocks.forEach(stock => {
        investedAmount += (stock.buyingPrice * stock.quantity);
        currentAmount += (stock.currentPrice * stock.quantity);
    })
    const xirReturn = calculateXIRRPercentage(stocks);
    const absReturn = (currentAmount - investedAmount) / investedAmount * 100;

    const [investedInt, investedDecimal] = splitNumberToIntAndDecimal(investedAmount)
    const [currentInt, currentDecimal] = splitNumberToIntAndDecimal(currentAmount)
    const [absReturnInt, absReturnDecimal] = splitNumberToIntAndDecimal(absReturn)
    const [xirReturnInt, xirReturnDecimal] = splitNumberToIntAndDecimal(xirReturn)

    const displayColor = getTailwindColorClassOnPriceComparison(investedAmount, currentAmount);

    return (
        <View className='flex-col bg-gray-100 dark:bg-slate-800 px-10'>
            <View className='flex-row' >
                <View className='flex-1 justify-center h-20'>
                    <Text className='text-sm font-light text-gray-500 dark:text-gray-300'>XIRR %</Text>
                    <Text className={'text-4xl font-normal ' + displayColor}>
                        {xirReturnInt + '.'}
                        <Text className='text-2xl'>{xirReturnDecimal}</Text>
                        <Text className='text-lg'>%</Text>
                    </Text>
                </View>
                <View className='flex-1 justify-center h-20 items-end'>
                    <Text className='text-sm font-light text-gray-500 dark:text-gray-300'>Total Returns %</Text>
                    <Text className={'text-4xl font-normal ' + displayColor}>
                        {absReturnInt + '.'}
                        <Text className='text-2xl'>{absReturnDecimal}</Text>
                        <Text className='text-lg'>%</Text>
                    </Text>
                </View>
            </View>
            <View className='flex-row' >
                <View className='flex-1 justify-center h-20'>
                    <Text className='text-sm font-light text-gray-500 dark:text-gray-300'>Invested</Text>
                    <Text className='text-xl font-light text-black dark:text-white'>
                        <Text className='font-semibold'>₹ </Text>
                        {investedInt + '.'}
                        <Text className='text-base'>{investedDecimal}</Text>
                    </Text>
                </View>
                <View className='flex-1 justify-center h-20 items-end'>
                    <Text className='text-sm font-light text-gray-500 dark:text-gray-300'>Current</Text>
                    <Text className='text-xl font-light text-black dark:text-white'>
                        <Text className='font-semibold'>₹ </Text>
                        {currentInt + '.'}
                        <Text className='text-base'>{currentDecimal}</Text>
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default PortfolioAtGlance