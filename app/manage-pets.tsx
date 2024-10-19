import {FlatList, SafeAreaView, Text} from "react-native";
import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "@/firebase.config";
import {petType} from "@/app/(tabs)/home";
import {useUser} from "@clerk/clerk-expo";
import {useEffect, useState} from "react";
import {PetCard} from "@/components/petCard";

const ManagePets = () => {
    const {user} = useUser()
    const userEmail = user?.primaryEmailAddress?.emailAddress
    const [userPets, setUserPets] = useState<petType[]>([]);
    const getUserPets = async () => {
        const q = query(collection(db, "Pets"), where("email", "==", userEmail))
        const snapShot = await getDocs(q)
        setUserPets(snapShot.docs.map(doc => doc.data() as petType))
    }
    useEffect(() => {
        getUserPets()
    }, [])

    return <SafeAreaView className={"p-3 flex-1"}>
        <Text className={"p-3 text-3xl font-bold"}>
            Manage Pets
        </Text>
        {userPets.length === 0 && <Text className={"text-center py-10 text-lg"}>
            No Posted Pets
        </Text>}
        <FlatList
            columnWrapperStyle={{
                gap: 10,
                paddingHorizontal: 10
            }}

            numColumns={2} data={userPets} renderItem={({item}) => {
            return <PetCard key={item.id} pet={item} owner={true}/>
        }}/>
    </SafeAreaView>
}
export default ManagePets