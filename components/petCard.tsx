import {petType} from "@/app/(tabs)/home";
import {useRouter} from "expo-router";
import {ActivityIndicator, Alert, Image, Text, TouchableOpacity, View} from "react-native";
import {Favourite} from "@/app/pet-details";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useState} from "react";
import {deleteDoc, doc} from "@firebase/firestore";
import {db} from "@/firebase.config";

const DeletePost = ({petID}: { petID: string }) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const router = useRouter()
    const deletePost = async () => {
        Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [{
            text: "Cancel",
            onPress: () => {
                return
            },

        },{
            text: "Delete",
            onPress: async () => {
                setIsDeleting(true)
                const docRef = doc(db, 'Pets', petID)
                await deleteDoc(docRef)
                router.replace('/manage-pets')
                setIsDeleting(false)
            }
        }])
    }

    return <TouchableOpacity
        onPress={deletePost}
    >{isDeleting ? <ActivityIndicator size={'large'}/> : <Ionicons name={'trash'} color={'red'} size={24}/>
    }
    </TouchableOpacity>
}
export const PetCard = ({pet, owner = false}: { pet: petType, owner?: boolean }) => {
    const router = useRouter()
    return <TouchableOpacity

        onPress={() => router.push({
            pathname: "/pet-details",
            params: pet
        })}
        className={"p-3  bg-white rounded-xl flex-1"}
    >
        <View className={"relative "}>
            <Image source={{
                uri: pet.imageUrl,
            }} className={"rounded-lg   my-1 w-full min-w-[135px] min-h-[135px] "}
            >

            </Image>
            <View className={"absolute right-2 top-2"}>
                {owner ? <View>
                    <DeletePost petID={pet.id}/>
                </View> : <Favourite petID={pet.id}/>
                }
            </View>
        </View>
        <Text className={"text-lg font-semibold"}>
            {pet.name}
        </Text>
        <View className={"flex justify-between items-center gap-2 flex-row"}>

            <Text className={"text-gray-500  flex-[1] "}
            >
                {pet.breed}
            </Text>
            <Text className={"text-gray-500 text-primary bg-accent-light-primary rounded-full px-2 text-xs"}>
                {pet.age} YRS
            </Text>
        </View>
    </TouchableOpacity>
}