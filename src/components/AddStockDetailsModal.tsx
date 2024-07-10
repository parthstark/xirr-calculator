import { View, Text, Modal, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, FlatList } from 'react-native'
import uuid from 'react-native-uuid'
import React, { useEffect, useState } from 'react'
import { Transaction } from '../types/types'
import { useColorScheme } from 'nativewind';
import { useRecoilState } from 'recoil';
import { stockSelectorFamily } from '../utils/atoms';
import DatePicker from 'react-native-date-picker';
import { isIos } from '../utils/utils';
import Divider from './base/Divider';
import TransactionDetail from './base/TransactionDetail';

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
    const clearTxFields = () => setTxObject({})
    const clearAllFields = () => {
        clearTxFields()
        if (!stockName) {
            setCurrStockName('')
            setCurrStockPrice('')
        }
    }

    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [currStockName, setCurrStockName] = useState('')
    const [currStockPrice, setCurrStockPrice] = useState('')
    const [stock, setStock] = useRecoilState(stockSelectorFamily(stockName ?? currStockName))
    const [txObject, setTxObject] = useState<{
        dateMs?: number,
        quantity?: string,
        buyingPrice?: string
    }>({})

    useEffect(() => {
        if (isModalVisible) clearAllFields()
    }, [isModalVisible])

    useEffect(() => {
        if (stock?.name) setCurrStockName(stock.name)
        if (stock?.currentPrice) setCurrStockPrice(stock.currentPrice.toString())
    }, [stock])

    const handleOnTickPress = () => {
        const currentTxs = stock?.transactions ?? []
        if (!isTxDetailsFilled || !currStockName || !currStockPrice) {
            return
        }

        setStock({
            name: currStockName,
            currentPrice: parseFloat(currStockPrice),
            transactions: [...currentTxs, {
                txId: uuid.v4(),
                dateOfPurchaseMsEpoch: txObject.dateMs!,
                quantity: parseInt(txObject.quantity!),
                buyingPrice: parseFloat(txObject.buyingPrice!),
            }]
        })
        clearTxFields()
    }

    const editable = (stock === undefined)
    const isTxDetailsFilled = !(!txObject.buyingPrice || !txObject.dateMs || !txObject.quantity)

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
                                    value={currStockName}
                                    onChangeText={(text) => { setCurrStockName(x => text) }}
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
                                    keyboardType='decimal-pad'
                                    returnKeyType='done'
                                    placeholderTextColor={placeHolderColor}
                                    value={currStockPrice}
                                    onChangeText={(text) => { setCurrStockPrice(x => text) }}
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
                                    data={stock?.transactions}
                                    renderItem={({ item }) => <TransactionDetail tx={item} />}
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
                                            {txObject.dateMs && new Date(txObject.dateMs).toLocaleDateString()}
                                            {!txObject.dateMs && <Text className='opacity-30'>{'DATE'}</Text>}
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
                                            value={txObject.quantity?.toString()}
                                            onChangeText={(text) => setTxObject({ ...txObject, quantity: text })}
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
                                            value={txObject.buyingPrice?.toString()}
                                            onChangeText={(text) => setTxObject({ ...txObject, buyingPrice: text })}
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
                        <TouchableOpacity onPress={onRequestClose} className='bg-black dark:bg-slate-200 items-center rounded-xl w-[90%] py-3 mb-5'>
                            <Text className='text-white dark:text-black text-xl font-light uppercase'>add to holdings</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                <DatePicker
                    modal
                    mode='date'
                    open={openDatePicker}
                    maximumDate={new Date()}
                    date={new Date(txObject.dateMs ?? new Date())}
                    onConfirm={(date) => {
                        setOpenDatePicker(x => false)
                        setTxObject({ ...txObject, dateMs: date.valueOf() })
                    }}
                    onCancel={() => setOpenDatePicker(x => false)}
                />
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default AddStockDetailsModal