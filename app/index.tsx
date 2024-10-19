import {SafeAreaView, Text} from "react-native";
import {Redirect, useRootNavigationState} from "expo-router";
import {useAuth, useUser} from "@clerk/clerk-expo";
import {useEffect, useMemo} from "react";

export default function Index() {
    const {isSignedIn} = useAuth()
    const rootNavigationState = useRootNavigationState()
    const CheckNavigationLoading = useMemo(() => (() => {
        if (rootNavigationState?.key) {
            return <Text>Loading...</Text>
        }
    }), [])
    useEffect(() => {
        CheckNavigationLoading();
    }, [])


    return (
        <SafeAreaView
        >
            {isSignedIn ?
                <Redirect href={"/(tabs)/home"}/>
                :
                <Redirect href={"/login"}/>
            }
        </SafeAreaView>
    );
}
