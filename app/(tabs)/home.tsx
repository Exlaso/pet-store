import {SafeAreaView, ScrollView, View} from "react-native";
import {useUser} from "@clerk/clerk-expo";
import {useEffect, useState} from "react";
import {PetsByCategory} from "@/components/petsByCategory";
import {CategorySection} from "@/components/categorySection";
import {Header} from "@/components/header";
import {Slider} from "@/components/slider";
import {AddNewPet} from "@/components/addNewPet";
import {Redirect} from "expo-router";
import {useFavourite} from "@/hooks/useFavourite";

export type docType = {
    imageUrl: string
    name: string
}
export type petType = {
    id:string
    "name": string
    "imageUrl": string
    "gender": string
    "age": number | string
    "breed": string
    "category": string
    "weight": number | string
    "basicInfo": string
    "streetAddress": string,
    "ownerName": string,
    email: string,
    "ownerImageUrl": string,
    "designation": string,
}

export default function Home() {

    const user = useUser()
    const {getFavourites} = useFavourite()
    const [selectCategory, setSelectCategory] = useState<string>("");
    if (!user.isSignedIn){
        return <Redirect href={"/login"} />
    }
    useEffect(()=> {
        getFavourites(user.user.primaryEmailAddress?.emailAddress)
    },[])

    return <SafeAreaView className={"flex flex-col  w-full h-full  "}>
            <Header user={user}/>
        <ScrollView className={"h-full   "}>
            <Slider/>
            <CategorySection selectCategory={selectCategory} setSelectCategory={setSelectCategory}/>
            <PetsByCategory category={selectCategory}/>
            <AddNewPet/>
        </ScrollView>
    </SafeAreaView>

}