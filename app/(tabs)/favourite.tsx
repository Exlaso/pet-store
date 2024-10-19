import {FlatList, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "@/firebase.config";
import {useFavourite} from "@/hooks/useFavourite";
import {petType} from "@/app/(tabs)/home";
import {PetCard} from "@/components/petCard";

export default function Favourite() {
    const {favourites} = useFavourite()
    const [favPets, setFavPets] = useState<petType[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const getFavPets = async () => {
        setIsRefreshing(true)
        const q = query(collection(db, 'Pets'), where('id', 'in', favourites))
        const querySnapshot = await getDocs(q)
        setFavPets(querySnapshot.docs.map(doc => doc.data() as petType))
        setIsRefreshing(false)
    }

    useEffect(() => {
        getFavPets()
    }, [])


    return <View className={"  h-full pt-10 flex-1   "}>
        <Text className={"text-3xl font-semibold p-5"}>
            Favourites
        </Text>
        <View className={"px-2 flex-1 "}>
            {favPets.length === 0 && <Text className={"text-center text-lg"}>
                No Favourite Pets
            </Text>}
            <FlatList className={" overflow-hidden    "}
                      onRefresh={getFavPets}
                      refreshing={isRefreshing}
                      columnWrapperStyle={{
                          gap: 10,
                          paddingVertical: 10
                      }}
                      numColumns={2} data={favPets} renderItem={(item) => {
                return <PetCard pet={item.item}/>
            }
            } keyExtractor={(item) => item.id}/>
        </View>
    </View>
}