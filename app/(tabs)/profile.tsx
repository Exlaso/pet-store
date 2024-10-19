import {FlatList, Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {useClerk, useUser} from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import {CONSTANT} from "@/constants";
import {useRouter} from "expo-router";

export default function Profile() {

    const menu: {
        id: number,
        name: string,
        icon: string,
        path: string
    }[] = [{
        id: 1,
        name: "Add New Pet",
        icon: 'add-circle',
        path: '/add-new-pet'
    },{
        id:5,
        name: "My Pets",
        icon: 'paw',
        path : 'manage-pets'
    }, {
        id: 2,
        name: "Favourite",
        icon: 'heart',
        path: '/(tabs)/favourite'
    }, {
        id: 3,
        name: "Inbox",
        icon: 'chatbubble',
        path: '/(tabs)/inbox'
    }, {
        id: 4,
        name: "Logout",
        icon: 'exit',
        path: 'logout'
    }]

    const {user} = useUser()
    const router = useRouter()
    const {signOut} = useClerk()
    return <SafeAreaView className={"flex-1"}>
        <Text className={"text-2xl font-semibold p-5"}>
            Profile
        </Text>
        <View className={"flex justify-center gap-1 items-center"}>
            <Image
                source={{
                    uri: user?.imageUrl
                }}
                className={"size-80 rounded-full"}
            />
            <Text className={"font-bold text-lg pt-5"}>
                {user?.fullName}
            </Text>
            <Text className={"text-gray-500 font-semibold"}>
                {user?.primaryEmailAddress?.emailAddress}
            </Text>
        </View>
        <FlatList
            contentContainerStyle={{
                gap: 20,
            }}
            scrollEnabled={false}
            className={"pt-10"}
            data={menu} renderItem={({item}) => {
            return <TouchableOpacity

                onPress={() => {
                    if (item.path === 'logout') {
                        signOut().then(() => {
                            router.replace('/login')
                        })
                    } else {
                        router.push(item.path as any)
                    }
                }}
                key={item.id} className={"p-4 mx-5  flex-row items-center bg-white rounded-md  "}>
                <View className={"bg-accent-light-primary p-2 rounded-lg mr-2"}>
                    <Ionicons name={item.icon as any} size={24} color={CONSTANT.Colors.primary} className={""}/>
                </View>
                <Text className={"text-sm font-bold"}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        }}/>
    </SafeAreaView>
}