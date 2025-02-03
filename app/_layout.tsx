import {Stack} from "expo-router";
import {ClerkLoaded, ClerkProvider} from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import {NavigationContainer} from "@react-navigation/native";


export interface TokenCache {
    getToken: (key: string) => Promise<string | undefined | null>;

    saveToken: (key: string, token: string) => Promise<void>;

    clearToken?: (key: string) => void;
}


export const tokenCache: TokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key);
            if (item) {
            } else {
                console.warn('No values stored under key: ' + key);
            }
            return item;
        } catch (error) {
            console.error('SecureStore get item error: ', error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    clearToken(key: string) {
        try {
            SecureStore.deleteItemAsync(key).then();
        } catch (e) {
            console.error('SecureStore delete item error: ', e);
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            return;
        }
    },
};

export default function RootLayout() {
    const EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

    return (
            <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
                <ClerkLoaded>

                    <Stack
                        screenOptions={{
                            headerShown: false,
                        }}
                    >
                        <Stack.Screen name="index"/>
                        <Stack.Screen name="login/index"/>
                        <Stack.Screen name={"(tabs)"}/>
                        <Stack.Screen name={"add-new-pet/index"}/>
                        <Stack.Screen name={"manage-pets"}/>
                        <Stack.Screen
                            name={"Chat/index"}
                            options={{
                                headerShown: true,
                            }}
                        />
                    </Stack>
                </ClerkLoaded>
            </ClerkProvider>
    );
}
