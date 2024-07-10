import { View, Text } from "react-native";
import { Transaction } from "../../types/types";

interface TransactionDetailProps {
    tx: Transaction,
    onPressDelete: () => void
}
const TransactionDetail = ({ tx, onPressDelete }: TransactionDetailProps) => {
    return (
        <View className='flex-row justify-between my-2'>
            <View className='flex-[1.5] flex-col items-start justify-end'>
                <Text className='text-xl font-light text-black dark:text-white'>
                    {new Date(tx.dateOfPurchaseMsEpoch).toDateString().slice(4)}
                </Text>
            </View>
            <View className='flex-1 flex-col items-center justify-end'>
                <Text className='text-2xl font-light text-black dark:text-white'>
                    {tx.quantity}
                </Text>
            </View>
            <View className='flex-1 flex-col items-end justify-end'>
                <Text className='text-xl font-light text-black dark:text-white'>
                    {tx.buyingPrice.toFixed(1)}
                </Text>
            </View>
            <View className='flex-[0.25] justify-center items-end mt-1 ml-[1] mr-[-1]'>
                <Text onPress={onPressDelete} className='text-red-500'>D</Text>
            </View>
        </View>
    );
}

export default TransactionDetail
