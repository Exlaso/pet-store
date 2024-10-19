import {UserResource} from "@clerk/types";
import {StatusBar} from "expo-status-bar";
import {Image, Text, View} from "react-native";
import {useClerk} from "@clerk/clerk-expo";

export function Header(props: {
    user: { isLoaded: false; isSignedIn: undefined; user: undefined } | {
        isLoaded: true;
        isSignedIn: false;
        user: null
    } | { isLoaded: true; isSignedIn: true; user: UserResource }
}) {
    return <View className={"  flex p-2 flex-row  items-start justify-between px-2 w-full  "}>

        <StatusBar style={"dark"}/>
        <View>
            <Text className={""}>
                Welcome,
            </Text>
            <Text className={"text-2xl font-semibold"}>
                {props.user?.user?.firstName}
            </Text>
        </View>
        <Image source={{uri: props.user?.user?.imageUrl}} className={"rounded-full border-1 size-40  "}

        />
    </View>
}