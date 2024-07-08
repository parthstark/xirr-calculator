import { View, Text } from 'react-native'
import React, { useMemo } from 'react'
import { splitNumberToIntAndDecimal, getTailwindColorClassOnPriceComparison } from '../utils/utils'
import { useRecoilValue } from 'recoil'
import { portfolioReturnsSeclector } from '../utils/atoms'

interface PortfolioAtGlanceProps {
}

const PortfolioAtGlance = ({ }: PortfolioAtGlanceProps) => {
    const { investedAmount, currentAmount, xirReturn, absReturn } = useRecoilValue(portfolioReturnsSeclector)

    const [investedInt, investedDecimal] = useMemo(() => splitNumberToIntAndDecimal(investedAmount), [investedAmount])
    const [currentInt, currentDecimal] = useMemo(() => splitNumberToIntAndDecimal(currentAmount), [currentAmount])
    const [xirReturnInt, xirReturnDecimal] = useMemo(() => splitNumberToIntAndDecimal(xirReturn), [xirReturn])
    const [absReturnInt, absReturnDecimal] = useMemo(() => splitNumberToIntAndDecimal(absReturn), [absReturn])

    const displayColor = useMemo(() => getTailwindColorClassOnPriceComparison(investedAmount, currentAmount), [investedAmount, currentAmount])

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