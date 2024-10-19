import {Text, TouchableOpacity} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import {CONSTANT} from "@/constants";
import {useRouter} from "expo-router";

export function AddNewPet() {
    const router = useRouter()

    return <TouchableOpacity
        onPress={() => {
            router.push("/add-new-pet")
        }}
        className={"flex mx-4 flex-row  justify-center  mb-10  h-auto   items-center rounded-md p-5 bg-accent-light-primary"}
        style={{
            borderStyle: "dashed",
            borderWidth: 1,
            borderColor: CONSTANT.Colors.primary
        }}>

        <MaterialIcons name={"pets"} size={24} color={CONSTANT.Colors.primary}/>
        <Text className={"mx-2 text-primary"}>
            Add New Pet
        </Text>
    </TouchableOpacity>;
}