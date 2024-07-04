import { View, Text, Modal, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList } from 'react-native'
import React from 'react'
import { Stock, Transaction } from '../types/types'
import { useColorScheme } from 'nativewind';
import Divider from './common/Divider';

interface AddStockDetailsModalProps {
    isModalVisible: boolean,
    onRequestClose: () => void,
    stock?: Stock,
}

const AddStockDetailsModal = ({
    isModalVisible,
    onRequestClose,
    stock,
}: AddStockDetailsModalProps) => {

    // chatgpt code
    // const panResponder = useRef(
    //     PanResponder.create({
    //         onStartShouldSetPanResponder: () => true,
    //         onMoveShouldSetPanResponder: () => true,
    //         onPanResponderMove: (_, gestureState) => {
    //             if (gestureState.dy > 50) {
    //                 onRequestClose()
    //             }
    //         },
    //     })
    // ).current;

    const { colorScheme } = useColorScheme();
    const placeHolderColor = (colorScheme === 'dark') ? '#666' : undefined;
    const editable = (stock === undefined)
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isModalVisible}
            onRequestClose={onRequestClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1 justify-end bg-black/70'
            // {...panResponder.panHandlers}
            >
                <Text onPress={onRequestClose} className='font-normal mb-1 text-center text-gray-100 dark:text-gray-400'>dismiss</Text>
                <View className='flex-[0.75]  bg-white dark:bg-slate-900 rounded-3xl'>
                    <SafeAreaView className='flex-1 items-center my-2'>
                        <View className='w-[100%] px-7 pt-7'>
                            <View className='flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 mb-7'>
                                <TextInput
                                    className='text-4xl w-4/5 font-light text-black dark:text-white'
                                    placeholder='name'
                                    autoCapitalize='characters'
                                    returnKeyType='done'
                                    placeholderTextColor={placeHolderColor}
                                    value={stock?.name}
                                    editable={editable}
                                />
                                {editable
                                    ? <Text className='font-extralight text-black dark:text-white'>x</Text>
                                    : <View />
                                }
                            </View>
                            <View className='flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 mb-7'>
                                {editable
                                    ? <Text className='font-extralight text-black dark:text-white'>x</Text>
                                    : <View />
                                }
                                <TextInput
                                    className='text-4xl w-4/5 font-light text-black dark:text-white'
                                    textAlign='right'
                                    placeholder='current price'
                                    keyboardType='decimal-pad'
                                    returnKeyType='done'
                                    placeholderTextColor={placeHolderColor}
                                    value={stock?.currentPrice.toFixed(2).toString()}
                                    editable={editable}
                                />
                            </View>
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
                            <View className='h-[240]'>
                                <FlatList
                                    data={stock?.transactions}
                                    renderItem={({ item }) => <TransactionDetail tx={item} />}
                                />
                            </View>
                            <View className='mx-36'>
                                <Divider />
                            </View>

                            {/* ADD NEW TX FIELDS */}
                            <View className='mb-3'>
                                <Text className='font-extralight text-black dark:text-white'>Add new transaction</Text>
                                <View className='flex-row my-1 border border-gray-400 rounded-lg'>
                                    <View className='flex-[1.5] border-r border-gray-400 p-2 px-5'>
                                        <TextInput
                                            className='text-xl font-light text-black dark:text-white'
                                            textAlign='left'
                                            placeholder='DATE'
                                            keyboardType='number-pad'
                                            returnKeyType='done'
                                            placeholderTextColor={placeHolderColor}
                                        />
                                    </View>
                                    <View className='flex-1 border-r border-gray-400 p-2 px-5'>
                                        <TextInput
                                            className='text-xl font-light text-black dark:text-white'
                                            textAlign='center'
                                            placeholder='QTY'
                                            keyboardType='number-pad'
                                            returnKeyType='done'
                                            placeholderTextColor={placeHolderColor}
                                        />
                                    </View>
                                    <View className='flex-1 border-r border-gray-400 p-2 px-5'>
                                        <TextInput
                                            className='text-xl font-light text-black dark:text-white'
                                            textAlign='right'
                                            placeholder='AVG'
                                            keyboardType='decimal-pad'
                                            returnKeyType='done'
                                            placeholderTextColor={placeHolderColor}
                                        />
                                    </View>
                                </View>
                                <Text className='text-right text-black dark:text-white font-bold text-xl m-[-10]'>✓</Text>
                            </View>
                        </View>
                        <View className='flex-1' />

                        {/* FOOTER */}
                        <TouchableOpacity onPress={onRequestClose} className='bg-black dark:bg-slate-200 items-center rounded-xl w-[90%] py-3 mb-5'>
                            <Text className='text-white dark:text-black text-xl font-light uppercase'>add to holdings</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default AddStockDetailsModal

interface TransactionDetailProps {
    tx: Transaction,
}
const TransactionDetail = ({ tx }: TransactionDetailProps) => {
    return (
        <View className='flex-row justify-between my-2'>
            <View className='flex-[1.5] flex-col items-start justify-end'>
                <Text className='text-xl font-light text-black dark:text-white'>
                    {tx.dateOfPurchase.toDateString().slice(4)}
                </Text>
            </View>
            <View className='flex-1 flex-col items-center justify-end'>
                <Text className='text-2xl font-light text-black dark:text-white'>
                    {tx.quantity}
                </Text>
            </View>
            <View className='flex-1 flex-col items-end justify-end'>
                <Text className='text-xl font-light text-black dark:text-white'>
                    {tx.buyingPrice.toFixed(2)}
                </Text>
            </View>
            <View className='flex-[0.25] justify-center items-end mt-1 ml-[1] mr-[-1]'>
                <Text className='text-red-500'>D</Text>
            </View>
        </View>
    );
}