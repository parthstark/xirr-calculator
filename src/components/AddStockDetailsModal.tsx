import { View, Text, Modal, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, FlatList, Alert } from 'react-native'
import uuid from 'react-native-uuid'
import React, { useEffect, useState } from 'react'
import { Stock } from '../types/types'
import { useColorScheme } from 'nativewind';
import { useRecoilState } from 'recoil';
import { portfolioHoldingsAtom, stockSelectorFamily } from '../utils/atoms';
import DatePicker from 'react-native-date-picker';
import { isIos } from '../utils/utils';
import Divider from './base/Divider';
import TransactionDetail from './base/TransactionDetail';

const emptyStock: Stock = {
    name: '',
    currentPrice: 0,
    transactions: []
}

interface AddStockDetailsModalProps {
    isModalVisible: boolean,
    onRequestClose: () => void,
    stockName?: string,
}

const AddStockDetailsModal = ({
    isModalVisible,
    onRequestClose,
    stockName,
}: AddStockDetailsModalProps) => {
    const { colorScheme } = useColorScheme();
    const placeHolderColor = (colorScheme === 'dark') ? '#666' : undefined;

    // BUG: current price input field not taking decimals
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [currentStock, setCurrentStock] = useState<Stock>(emptyStock)
    const [portfolioStock, setPortfolioStock] = useRecoilState(stockSelectorFamily(stockName ?? currentStock.name))
    const [portfolioHoldings, setPortfolioHoldings] = useRecoilState(portfolioHoldingsAtom)
    const [txFieldObject, setTxFieldObject] = useState<{
        dateMs?: number,
        quantity?: string,
        buyingPrice?: string
    }>({})

    useEffect(() => {
        if (isModalVisible) resetAllFields()
    }, [isModalVisible])

    useEffect(() => {
        if (portfolioStock) setCurrentStock(portfolioStock) //found stock in holdings -> update current stock
        else setCurrentStock({ ...emptyStock, name: currentStock.name }) //undefined -> emptystock, BUT retain name in input field
    }, [portfolioStock])

    const editable = !stockName
    const isTxDetailsFilled = !(!txFieldObject.buyingPrice || !txFieldObject.dateMs || !txFieldObject.quantity)

    const handleOnTickPress = () => {
        if (!isTxDetailsFilled) {
            return
        }

        setCurrentStock({
            ...currentStock,
            transactions: [...currentStock.transactions, {
                txId: uuid.v4(),
                dateOfPurchaseMsEpoch: txFieldObject.dateMs!,
                quantity: parseInt(txFieldObject.quantity!),
                buyingPrice: parseFloat(txFieldObject.buyingPrice!),
            }]
        })
        clearTxFields()
    }

    const handleOnSaveButtonPress = () => {
        if (!editable && currentStock.transactions.length !== (portfolioStock?.transactions.length ?? 0)) {
            setPortfolioStock(currentStock)
            onRequestClose()
        }
        else if (editable && currentStock.name && currentStock.currentPrice && currentStock.transactions.length) {
            setPortfolioHoldings([...portfolioHoldings, currentStock])
            onRequestClose()
        }
    }

    const handleOnDeleteButtonPress = () => {
        Alert.alert(
            'Delete stock',
            'Are you sure you want to remove this stock from your portfolio?',
            [
                {
                    text: 'confirm',
                    onPress: () => {
                        const updatedHoldings = portfolioHoldings.filter(stock => stock.name !== currentStock.name)
                        setPortfolioHoldings([...updatedHoldings])
                        onRequestClose()
                    }
                }
            ]
        )
    }

    const clearTxFields = () => setTxFieldObject({})
    const resetAllFields = () => {
        clearTxFields()
        if (!stockName) {
            setCurrentStock(emptyStock)
        } else {
            setCurrentStock(portfolioStock ?? emptyStock)
        }
    }

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isModalVisible}
            onRequestClose={onRequestClose}
        >
            <KeyboardAvoidingView
                behavior={isIos() ? 'padding' : 'height'}
                className='flex-1 justify-end bg-black/70'
            >
                <Text onPress={onRequestClose} className='font-normal mb-1 text-center text-gray-100 dark:text-gray-400'>dismiss</Text>
                <View className='bg-white dark:bg-slate-900 rounded-t-3xl'>
                    <SafeAreaView className='items-center my-2'>
                        <View className='w-[100%] px-7 pt-7'>
                            <View className='flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 mb-7'>
                                <TextInput
                                    className='text-4xl w-4/5 font-light text-black dark:text-white'
                                    placeholder='name'
                                    autoCapitalize='characters'
                                    returnKeyType='done'
                                    placeholderTextColor={placeHolderColor}
                                    value={currentStock.name}
                                    onChangeText={(text) => { setCurrentStock({ ...currentStock, name: text }) }}
                                    editable={editable}
                                />
                                {editable
                                    ? <Text className='font-extralight text-black dark:text-white'>x</Text>
                                    : <View />
                                }
                            </View>
                            <View className='flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 mb-7'>
                                <Text className='font-extralight text-black dark:text-white'>x</Text>
                                <TextInput
                                    className='text-4xl w-4/5 font-light text-black dark:text-white'
                                    textAlign='right'
                                    placeholder='current price'
                                    keyboardType='number-pad'
                                    returnKeyType='done'
                                    placeholderTextColor={placeHolderColor}
                                    value={
                                        currentStock.currentPrice
                                            ? currentStock.currentPrice.toString()
                                            : ''
                                    }
                                    onChangeText={(text) => { setCurrentStock({ ...currentStock, currentPrice: parseFloat(text) }) }}
                                />
                            </View>

                            {/* title header */}
                            <View className='flex-row justify-between bg-gray-200 dark:bg-slate-700 py-2 px-10 mx-[-40]'>
                                <View className='flex-[1.5] items-start'>
                                    <Text className='text-xs font-light text-gray-500 dark:text-gray-50'>DATE OF PURCHASE</Text>
                                </View>
                                <View className='flex-1 items-center'>
                                    <Text className='text-xs font-light text-gray-500 dark:text-gray-50'>QUANTITY</Text>
                                </View>
                                <View className='flex-1 items-end'>
                                    <Text className='text-xs font-light text-gray-500 dark:text-gray-50'>BUY PRICE</Text>
                                </View>
                                <View className='flex-[0.25]' />
                            </View>

                            {/* TXs  */}
                            <View className='min-h-[112] max-h-[144]'>
                                <FlatList
                                    data={currentStock.transactions}
                                    renderItem={({ item }) => {
                                        const onPressDelete = () => {
                                            const updatedTxs = currentStock.transactions.filter(tx => tx.txId != item.txId)
                                            setCurrentStock({ ...currentStock, transactions: updatedTxs })
                                        }
                                        return <TransactionDetail onPressDelete={onPressDelete} tx={item} />
                                    }
                                    }
                                />
                            </View>
                            <View className='mx-36'>
                                <Divider />
                            </View>

                            {/* ADD NEW TX FIELDS */}
                            <View className='mb-5'>
                                <Text className='font-extralight text-black dark:text-white'>Add new transaction</Text>
                                <View className='flex-row my-1 border border-gray-400 rounded-lg'>
                                    <View className='flex-[1.5] border-r border-gray-400 p-2 px-5'>
                                        <Text
                                            className={'text-xl font-light text-black dark:text-white'}
                                            onPress={() => setOpenDatePicker(x => true)}
                                        >
                                            {txFieldObject.dateMs && new Date(txFieldObject.dateMs).toLocaleDateString()}
                                            {!txFieldObject.dateMs && <Text className='opacity-30'>{'DATE'}</Text>}
                                        </Text>
                                    </View>
                                    <View className='flex-1 border-r border-gray-400 p-2 px-5'>
                                        <TextInput
                                            className='text-xl font-light text-black dark:text-white bottom-0.5'
                                            textAlign='center'
                                            placeholder='QTY'
                                            keyboardType='number-pad'
                                            returnKeyType='done'
                                            placeholderTextColor={placeHolderColor}
                                            value={txFieldObject.quantity?.toString()}
                                            onChangeText={(text) => setTxFieldObject({ ...txFieldObject, quantity: text })}
                                            contextMenuHidden
                                        />
                                    </View>
                                    <View className='flex-1 border-r border-gray-400 p-2 px-5'>
                                        <TextInput
                                            className='text-xl font-light text-black dark:text-white bottom-0.5'
                                            textAlign='right'
                                            placeholder='AVG'
                                            keyboardType='decimal-pad'
                                            returnKeyType='done'
                                            placeholderTextColor={placeHolderColor}
                                            value={txFieldObject.buyingPrice?.toString()}
                                            onChangeText={(text) => setTxFieldObject({ ...txFieldObject, buyingPrice: text })}
                                            contextMenuHidden
                                        />
                                    </View>
                                </View>
                                {isTxDetailsFilled &&
                                    <Text
                                        onPress={handleOnTickPress}
                                        className='text-right text-black dark:text-white font-bold text-xl m-[-10]'>
                                        ✓
                                    </Text>
                                }
                            </View>
                        </View>

                        {/* FOOTER */}
                        <TouchableOpacity onPress={handleOnSaveButtonPress} className='bg-black dark:bg-slate-200 items-center rounded-xl w-[90%] py-3 mb-3'>
                            <Text className='text-white dark:text-black text-xl font-light uppercase'>save to holdings</Text>
                        </TouchableOpacity>

                        {!editable &&
                            <TouchableOpacity onPress={handleOnDeleteButtonPress} >
                                <Text className='text-black dark:text-white text-base font-normal uppercase'>DELETE</Text>
                            </TouchableOpacity>
                        }
                    </SafeAreaView>
                </View>

                <DatePicker
                    modal
                    mode='date'
                    open={openDatePicker}
                    maximumDate={new Date()}
                    date={new Date(txFieldObject.dateMs ?? new Date())}
                    onConfirm={(date) => {
                        setOpenDatePicker(x => false)
                        setTxFieldObject({ ...txFieldObject, dateMs: date.valueOf() })
                    }}
                    onCancel={() => setOpenDatePicker(x => false)}
                />
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default AddStockDetailsModal