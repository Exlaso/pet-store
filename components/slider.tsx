import {useEffect, useState} from "react";
import {collection, getDocs} from "@firebase/firestore";
import {db} from "@/firebase.config";
import { Dimensions, FlatList, Image, Pressable, Text, View} from "react-native";
import {docType} from "@/app/(tabs)/home";


export function Slider() {
    const [slider, setSlider] = useState<docType[]>([]);
    const handleClick = async () => {
        try {
            setSlider([])
            const snapshot = await getDocs(collection(db, "Slider"));
            setSlider(snapshot.docs.map(doc => doc.data() as docType))
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }

    useEffect(() => {

        handleClick().then();
        return () => {
        }
    }, [])
    return <View className={"w-full my-5"}>
        <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={slider} renderItem={({item}) => {
            return <View>
                <Image source={{uri: item.imageUrl, height: 160, width: Dimensions.get("screen").width * 0.9}}
                       className={"rounded-lg h-[200px] object-contain mx-4"}/>
            </View>
        }}/>
    </View>;
}
