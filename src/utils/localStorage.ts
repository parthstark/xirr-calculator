import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stock } from "../types/types";
import { HOLDINGS_LOCAL_STORAGE_KEY } from "../constants/constants";

export const saveStocksToLocalStorage = async (data: Stock[]) => {
    try {
        const value = JSON.stringify(data);
        await AsyncStorage.setItem(HOLDINGS_LOCAL_STORAGE_KEY, value);
    } catch (e) {
        console.error('Error saving data:', e);
    }
};

export const getStocksFromLocalStorage = async (): Promise<Stock[]> => {
    try {
        const value = await AsyncStorage.getItem(HOLDINGS_LOCAL_STORAGE_KEY);
        if (value) return JSON.parse(value)
    } catch (e) {
        console.error('Error reading data:', e);
    }
    return []
};

export const clearsFromLocalStorage = async () => {
    try {
        await AsyncStorage.removeItem(HOLDINGS_LOCAL_STORAGE_KEY);
    } catch (e) {
        console.error('Error reading data:', e);
    }
};