import {Tabs} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Text} from "react-native";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
export default function TabLayout() {
    return <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: {
            backgroundColor: 'white',
        },
        tabBarLabel: (d) => {
            return <Text className={"text-[10px]"}>
                {capitalize(d.children)}
            </Text>
        },
        tabBarActiveTintColor: 'red'
    }}>

        <Tabs.Screen name={'home'}
                     options={{
                         tabBarIcon: ({color,size}) => {
                             return <Ionicons name="home"  size={size} color={color}/>
                         },
                     }}
        />
        <Tabs.Screen name={'inbox'} options={{
            tabBarIcon: ({color,size}) => {
                return <Ionicons name="chatbubble" size={size} color={color}/>
            },
        }}/>
        <Tabs.Screen name={'favourite'} options={{
            tabBarIcon: ({color,size}) => {
                return <Ionicons name="heart" size={size} color={color}/>
            },
        }}/>
        <Tabs.Screen name={'profile'} options={{
            tabBarIcon: ({color,size}) => {
                return <Ionicons name="people" size={size} color={color}/>
            },
        }}/>
    </Tabs>
}