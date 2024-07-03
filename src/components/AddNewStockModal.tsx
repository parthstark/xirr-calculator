import { View, Text, Modal, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'

interface AddNewStockModalProps {
    isModalVisible: boolean,
    onRequestClose: () => void,
}

const AddNewStockModal = ({
    isModalVisible,
    onRequestClose,
}: AddNewStockModalProps) => {
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={isModalVisible}>
            <View className='flex-1 justify-end bg-black/50'>
                <View className='flex-[0.75]  bg-white dark:bg-slate-900 rounded-3xl'>
                    <SafeAreaView className='flex-1 items-center justify-between my-2'>
                        <View className='flex-row justify-end w-[100%] px-5'>
                            <Text onPress={onRequestClose} className='font-normal text-2xl text-black dark:text-slate-100'>x</Text>
                        </View>
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