import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useColorScheme } from 'nativewind'
import PortfolioHoldingItem from './PortfolioHoldingItem';
import PortfolioAtGlance from './PortfolioAtGlance';
import AddStockDetailsModal from './AddStockDetailsModal';
import { useRecoilValue } from 'recoil';
import { portfolioHoldingsAtom } from '../utils/atoms';

interface StockModalStateData {
    open: boolean,
    stockName?: string,
}

const PortfolioScreen = () => {

    const stocks = useRecoilValue(portfolioHoldingsAtom)

    const { toggleColorScheme } = useColorScheme();
    const [stockModalData, setStockModalData] = useState<StockModalStateData>({ open: false })
    const openAddStockModal = (stockName?: string) => setStockModalData(x => ({ open: true, stockName: stockName }));
    const closeAddStockModal = () => setStockModalData(x => ({ open: false }));

    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: stockModalData.open ? 0.95 : 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [stockModalData]);

    const button = (
        <TouchableOpacity
            onPress={() => openAddStockModal()}
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

                    <PortfolioAtGlance />

                    {titleHeader}

                    <ScrollView className='px-5'>

                        {
                            stocks.map((stock, i) => (
                                <PortfolioHoldingItem
                                    onPress={() => openAddStockModal(stock.name)}
                                    stockName={stock.name}
                                    key={i}
                                />
                            )
                            )
                        }

                        {button}
                    </ScrollView>

                    <AddStockDetailsModal
                        isModalVisible={stockModalData.open}
                        onRequestClose={closeAddStockModal}
                        stockName={stockModalData.stockName}
                    />
                </SafeAreaView>
            </Animated.View>
        </View>
    )
}

export default PortfolioScreen