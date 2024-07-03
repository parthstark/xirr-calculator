import { View, Text, Modal, SafeAreaView, TouchableOpacity, PanResponder, TextInput } from 'react-native'
import React, { useRef } from 'react'
import { Stock } from '../types/types'
import { useColorScheme } from 'nativewind';

interface AddNewStockModalProps {
    isModalVisible: boolean,
    onRequestClose: () => void,
    stock?: Stock,
}

const AddNewStockModal = ({
    isModalVisible,
    onRequestClose,
    stock,
}: AddNewStockModalProps) => {

    // chatgpt code
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 50) {
                    onRequestClose()
                }
            },
        })
    ).current;

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
            <View className='flex-1 justify-end bg-black/50' {...panResponder.panHandlers}>
                <Text onPress={onRequestClose} className='font-light mb-1 text-center text-gray-100 dark:text-gray-400'>dismiss</Text>
                <View className='flex-[0.75]  bg-white dark:bg-slate-900 rounded-3xl'>
                    <SafeAreaView className='flex-1 items-center my-2'>
                        <View className='w-[100%] px-7 pt-7'>
                            <View className='flex-row justify-between items-center border-b border-slate-200 dark:border-slate-700 mb-7'>
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
                            <View className='flex-row justify-between items-center border-b border-slate-200 dark:border-slate-700 mb-7'>
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
                        </View>
                        <View className='flex-1' />

                        {/* FOOTER */}
                        <TouchableOpacity onPress={onRequestClose} className='bg-black dark:bg-slate-200 items-center rounded-xl w-[90%] py-3 mb-5'>
                            <Text className='text-white dark:text-black text-xl font-light uppercase'>add to holdings</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    )
}

export default AddNewStockModal