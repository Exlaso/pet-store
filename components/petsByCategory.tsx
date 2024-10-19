import {FlatList, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "@/firebase.config";
import {petType} from "@/app/(tabs)/home";
import {PetCard} from "@/components/petCard";

export const PetsByCategory = ({category}: { category: string }) => {
    const [Pets, setPets] = useState<petType[]>([]);
    useEffect(() => {
        (async () => {
            const q = query(collection(db, "Pets"), where("category", "==", category))
            const querySnapshot = await getDocs(q);
            setPets(querySnapshot.docs.map(doc => doc.data() as petType))
        })()
    }, [category])
    return <View>
        <FlatList
            contentContainerStyle={{ gap: 20, padding: 10 }}
            className={"p-2 "}
            ListEmptyComponent={<View className={"h-32 flex  justify-center items-center"}>
                <Text>
                    No Pets Found
                </Text>
            </View>
            }
            showsHorizontalScrollIndicator={false} horizontal={true} data={Pets} renderItem={pet => {
            return <PetCard pet={pet.item} key={pet.item.imageUrl}/>
        }}/>
    </View>
}