import {ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, Text, View} from "react-native"
import React, {useEffect, useState} from "react";
import * as WebBrowser from 'expo-web-browser'
import {useNavigation, useRouter} from 'expo-router'
import {useClerk, useOAuth, useUser} from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import {CONSTANT} from "@/constants";


export const useWarmUpBrowser = () => {
    useEffect(() => {
        if (Platform.OS !== 'web') {
            void WebBrowser.warmUpAsync();
            return () => {
                void WebBrowser.coolDownAsync();
            };
        }
    }, []);
}
WebBrowser.maybeCompleteAuthSession()
const LoginScreen = () => {
    useWarmUpBrowser()
    const router = useRouter()
    const {startOAuthFlow} = useOAuth({strategy: 'oauth_google'})
    const [loading, setLoading] = useState<boolean>(false);
    const onPress = React.useCallback(async () => {
        setLoading(true)
        try {
            // clear session
            const {createdSessionId, signIn, signUp, setActive} = await startOAuthFlow({
                redirectUrl: Linking.createURL('/(tabs)/home', {scheme: 'myapp'}),

            })

            if (createdSessionId) {
                await setActive?.({session: createdSessionId});
                router.push('/(tabs)/home')
            } else {
                Alert.alert("Something went wrong")
            }
        } catch (err) {
            Alert.alert( JSON.stringify(err, null, 2))
            console.error('OAuth error', JSON.stringify(err, null, 2))
        }
        setLoading(false)
    }, [startOAuthFlow])


    const {isSignedIn} = useUser()
    if (isSignedIn) {
        router.push('/(tabs)/home')
    }
    return (
        <ScrollView
            style={{
                backgroundColor: 'ffffff',
                height: '100%',
            }}>
            <Image
                source={{
                    uri: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
                }}
                style={{
                    width: "100%",
                    height: 500
                }}
            />
            <View
                style={{
                    padding: 20
                }}>
                <Text
                    style={{
                        fontFamily: 'outfit-bold',
                        fontSize: 30,
                        textAlign: 'center'
                    }}
                >Ready to make a new friend?</Text>
                <Text
                    style={{
                        fontFamily: 'outfit',
                        fontSize: 18,
                        textAlign: 'center',
                        color: 'gray',
                        marginTop: 10
                    }}>
                    Let's adopt the pet which you like and make there life happy again
                </Text>
                {loading ? <ActivityIndicator

                    style={{
                        padding: 14,
                        marginTop: 10,
                        backgroundColor: CONSTANT.Colors.primary,
                        width: '100%',
                        borderRadius: 14
                    }}
                    size={'large'}/> : <Pressable
                    onPress={onPress}
                    style={{
                        padding: 14,
                        marginTop: 10,
                        backgroundColor: CONSTANT.Colors.primary,
                        width: '100%',
                        borderRadius: 14
                    }}>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 20,
                            fontFamily: 'outfit-medium'
                        }}
                    >Get Started</Text>
                </Pressable>}
            </View>
        </ScrollView>
    )
}
export default LoginScreen;