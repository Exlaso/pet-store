import {useEffect, useMemo, useState} from "react";
import {collection, getDocs} from "@firebase/firestore";
import {db} from "@/firebase.config";
import {FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import {cn} from "@/lib/cn";
import {docType} from "@/app/(tabs)/home";

export const CategorySection = ({setSelectCategory, selectCategory}: {
    setSelectCategory: (category: string) => void;
    selectCategory: string;
}) => {
    const [categories, setCategories] = useState<docType[]>([]);
    const getCategories = useMemo(() => (async () => {
        setCategories([])
        const snapshot = await getDocs(collection(db, "Category"));
        setCategories(snapshot.docs.map(doc => doc.data() as docType))
        setSelectCategory(snapshot.docs[0].data().name)
    }), [])
    useEffect(() => {
        getCategories().then()


    }, [])
    return <View className={"w-full px-4"}>
        <Text className={" text-lg font-bold my-2  "}>
            Category
        </Text>
        <FlatList
            scrollEnabled={false}
            className={" "}
            numColumns={4}
            showsHorizontalScrollIndicator={false}
            data={categories} renderItem={({item}) => {
            return <TouchableOpacity key={item.name} className={"flex-1"}
                                     onPress={() => setSelectCategory(item.name)}
            >
                <View
                    className={cn('flex-1 border-accent-light-blue border bg-accent-light-primary mx-1  items-center p-2 rounded-2xl',
                        selectCategory === item.name && "bg-accent-light-blue"
                    )}>
                    <Image source={{uri: item.imageUrl, height: 40, width: 40}}
                           className={"  object-contain mx-1 "}/>

                </View>
                <Text className={"text-center my-1"}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        }}/>
    </View>;
}