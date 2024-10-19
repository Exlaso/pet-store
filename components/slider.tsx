import {useEffect, useMemo, useState} from "react";
import {collection, getDocs} from "@firebase/firestore";
import {db} from "@/firebase.config";
import {Dimensions, FlatList, Image, View} from "react-native";
import {docType} from "@/app/(tabs)/home";

export function Slider() {
    const [slider, setSlider] = useState<docType[]>([]);
    const getSliders = useMemo(() => (async () => {
        setSlider([])
        const snapshot = await getDocs(collection(db, "Slider"));
        setSlider(snapshot.docs.map(doc => doc.data() as docType))
    }), [])
    useEffect(() => {
        getSliders().then()
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