import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useColorScheme } from 'nativewind'
import uuid from 'react-native-uuid';
import PortfolioHoldingItem from './PortfolioHoldingItem';
import PortfolioAtGlance from './PortfolioAtGlance';
import { Stock } from '../types/types';
import AddStockDetailsModal from './AddStockDetailsModal';

const teststocks: Stock[] = [
    {
        name: 'TATAMOTORS',
        currentPrice: 302.2399343,
        transactions: [{
            txId: uuid.v4(),
            quantity: 1000,
            buyingPrice: 195.61884,
            dateOfPurchase: new Date(2021, 12, 23),
        },]
    },
    {
        name: 'PAYTM',
        currentPrice: 890.44,
        transactions: [{
            txId: uuid.v4(),
            quantity: 20,
            buyingPrice: 2567,
            dateOfPurchase: new Date(2023, 4, 4),
        },]
    },
    {
        name: 'INFY',
        currentPrice: 1510.235,
        transactions: [{
            txId: uuid.v4(),
            quantity: 1250,
            buyingPrice: 499.01,
            dateOfPurchase: new Date(2020, 28, 3),
        },]
    }
]

const myStocks: Stock[] = [
    {
        name: 'NIFTYBEES',
        currentPrice: 270.23,
        transactions: [
            {
                txId: uuid.v4(),
                quantity: 300,
                buyingPrice: 250.30,
                dateOfPurchase: new Date(2024, 5, 4),
            },
            {
                txId: uuid.v4(),
                quantity: 150,
                buyingPrice: 180.30,
                dateOfPurchase: new Date(2024, 1, 9),
            },
        ]
    },
    {
        name: 'MIDCAPETF',
        currentPrice: 21.29,
        transactions: [{
            txId: uuid.v4(),
            quantity: 8000,
            buyingPrice: 18.62,
            dateOfPurchase: new Date(2024, 5, 4),
        },]
    }
]

const stocks = myStocks;

const PortfolioScreen = () => {

    const { toggleColorScheme } = useColorScheme();
    const [isAddStockModalVisible, setIsAddStockModalVisible] = useState(false)
    const openAddStockModal = () => setIsAddStockModalVisible(x => true);
    const closeAddStockModal = () => setIsAddStockModalVisible(x => false);

    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: isAddStockModalVisible ? 0.95 : 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [isAddStockModalVisible]);

    const button = (
        <TouchableOpacity
            onPress={openAddStockModal}
            className=' scale-90 flex-row justify-between items-center h-20 border-gray-300 dark:border-gray-500 border-2 border-dashed rounded-full px-5 my-5'>
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

    const bgStyle = 'flex-1 bg-white dark:bg-slate-900'
    return (
        <View className={bgStyle}>
            <Animated.View
                style={{ transform: [{ scale: scaleValue }] }}
                className={bgStyle}>
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
                            stocks.map((stock, i) => {
                                return <PortfolioHoldingItem stock={stock} key={i} />
                            })
                        }

                        {button}
                    </ScrollView>

                    <AddStockDetailsModal
                        isModalVisible={isAddStockModalVisible}
                        onRequestClose={closeAddStockModal}
                    // stock={stocks[0]}
                    />
                </SafeAreaView>
            </Animated.View>
        </View>
    )
}

export default PortfolioScreen