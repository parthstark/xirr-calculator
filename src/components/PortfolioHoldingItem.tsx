import { View, Text, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { getTailwindColorClassOnPriceComparison, splitNumberToIntAndDecimal } from '../utils/utils';
import Divider from './common/Divider';
import { useRecoilValue } from 'recoil';
import { stockReturnsSelectorFamily } from '../utils/atoms';

interface PortfolioHoldingItem {
    stockName: string,
    onPress: () => void,
}

const PortfolioHoldingItem = ({ stockName, onPress }: PortfolioHoldingItem) => {

    const { investedAmount, currentAmount, xirReturn, absReturn, totalQuantity } = useRecoilValue(stockReturnsSelectorFamily(stockName))

    const [investedInt, investedDecimal] = useMemo(() => splitNumberToIntAndDecimal(investedAmount), [investedAmount])
    const [currentInt, currentDecimal] = useMemo(() => splitNumberToIntAndDecimal(currentAmount), [currentAmount])
    const [xirReturnInt, xirReturnDecimal] = useMemo(() => splitNumberToIntAndDecimal(xirReturn), [xirReturn])
    const [absReturnInt, absReturnDecimal] = useMemo(() => splitNumberToIntAndDecimal(absReturn), [absReturn])

    const displayColor = useMemo(() => getTailwindColorClassOnPriceComparison(investedAmount, currentAmount), [investedAmount, currentAmount])

    return (
        <TouchableOpacity onPress={onPress} className='flex-col mt-5'>
            <View className='flex-row justify-between'>
                <View className='flex-[1.5] flex-col items-start justify-end'>
                    <Text className='text-xl font-light text-black dark:text-white'>
                        {stockName}
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