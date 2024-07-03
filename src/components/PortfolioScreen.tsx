import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useColorScheme } from 'nativewind'
import uuid from 'react-native-uuid';
import PortfolioHoldingItem from './PortfolioHoldingItem';
import PortfolioAtGlance from './PortfolioAtGlance';
import { Stock } from '../types/types';

const stocks: Stock[] = [
    {
        txId: uuid.v4().toString(),
        name: 'TATAMOTORS',
        quantity: 1000,
        buyingPrice: 195.61884,
        currentPrice: 302.2399343,
        dateOfPurchase: new Date(2021, 12, 23),
    },
    {
        txId: uuid.v4().toString(),
        name: 'PAYTM',
        quantity: 20,
        buyingPrice: 2567,
        currentPrice: 890.44,
        dateOfPurchase: new Date(2023, 4, 4),
    },
    {
        txId: uuid.v4().toString(),
        name: 'INFY',
        quantity: 1250,
        buyingPrice: 499.01,
        currentPrice: 1510.235,
        dateOfPurchase: new Date(2020, 28, 3),
    }
]

const PortfolioScreen = () => {
    const button = (
        <TouchableOpacity className=' scale-90 flex-row justify-between items-center h-20 border-gray-300 dark:border-gray-500 border-2 border-dashed rounded-full px-5 my-5'>
            <Text className='text-6xl font-extralight text-black dark:text-white'>+</Text>
            <Text className='text-3xl font-extralight text-gray-500 dark:text-gray-50'>Tap to add new stock</Text>
            <Text className='text-transparent text-2xl font-extralight'>+</Text>
        </TouchableOpacity>
    )

    const titleHeader = (
        <View className='flex-row justify-between bg-gray-200 dark:bg-slate-700  py-2 px-6'>
            <View className='flex-[1.5] items-start'>
                <Text className='text-xs font-light text-gray-500 dark:text-gray-50'>STOCK</Text>
                <Text className='text-xs font-light text-gray-500 dark:text-gray-50'>QUANTITY</Text>
            </View>
            <View className='flex-1 items-center'>
                <Text className='text-xs font-light text-gray-500 dark:text-gray-50'>XIRR %</Text>
                <Text className='text-xs font-light text-gray-500 dark:text-gray-50'>NET %</Text>
            </View>
            <View className='flex-1 items-end'>
                <Text className='text-xs font-light text-gray-500 dark:text-gray-50'>LTP</Text>
                <Text className='text-xs font-light text-gray-500 dark:text-gray-50'>AVG</Text>
            </View>
        </View>
    )

    const { toggleColorScheme } = useColorScheme();

    return (
        <View className='flex-1 bg-white dark:bg-slate-900'>
            <SafeAreaView className='flex-1'>
                <View className='flex-row justify-between items-center'>
                    <Text className='text-5xl font-light m-5 text-black dark:text-white'>
                        Portfolio
                    </Text>
                    <TouchableOpacity onPress={toggleColorScheme}>
                        <Text className='text-3xl font-light m-5 text-black dark:text-white'>
                            Φ
                        </Text>
                    </TouchableOpacity>
                </View>

                <PortfolioAtGlance stocks={stocks} />

                {titleHeader}

                <ScrollView className='px-5'>

                    {
                        stocks.map(stock => {
                            return <PortfolioHoldingItem stock={stock} key={stock.txId} />
                        })
                    }

                    {button}
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default PortfolioScreen