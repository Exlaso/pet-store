import {Alert, Image, ImageSourcePropType, Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {useLocalSearchParams, useRouter} from "expo-router";
import {petType} from "@/app/(tabs)/home";
import {StatusBar} from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {useState} from "react";
import {CONSTANT} from "@/constants";
import {useFavourite} from "@/hooks/useFavourite";
import {useUser} from "@clerk/clerk-expo";
import {collection, doc, getDocs, query, setDoc, where} from "@firebase/firestore";
import {db} from "@/firebase.config";


const Feature = ({title, url, value}: {
    url: ImageSourcePropType
    title: keyof petType
    value: string
}) => {
    return <View className={'bg-white p-2 overflow-hidden flex-1 rounded-md flex flex-row mx-2  '}>
        <View className={"bg-accent-light-primary p-2 rounded-md"}>
            <Image source={url}
                   className={" object-contain m flex justify-center items-center   "}
                   style={{
                       width: 25,
                       height: 25,
                       padding: 1,
                   }}
            >
            </Image>
        </View>

        <View className={"flex justify-center mx-1"}>
            <Text className={"capitalize text-gray-500"}>
                {title}
            </Text>
            <Text className={"text-black font-bold"}>
                {value}
            </Text>
        </View>
    </View>
}


export function Favourite({petID}: { petID: string }) {
    const {favourites, removeFavorite, addFavorite} = useFavourite()


    const isFav = favourites.includes(petID)
    return <View>
        <Pressable onPress={() => {
            if (!isFav) {
                addFavorite(petID)
            } else {
                removeFavorite(petID)
            }
        }}>
            <Ionicons name={isFav ? "heart" : "heart-outline"} size={30} className={"  "}
                      color={isFav ? 'red' : 'black'}/>
        </Pressable>
    </View>
}

function PetName(props: { pet: petType }) {
    return <View className={"flex flex-row justify-between items-center p-5"}>
        <View className={"flex flex-col gap-2"}>
            <Text className={"text-lg font-bold  "}>
                {props.pet.name}
            </Text>
            <View className={"flex flex-row items-center overflow-hidden w-10/12"}>
                <Ionicons name={"location-outline"} size={24} color={"#000"}/>
                <Text className={"text-[10rem] "}>
                    {props.pet.streetAddress}
                </Text>
            </View>
        </View>
        <Favourite petID={props.pet.id}/>
    </View>;
}

function PetFeatures(props: { pet: petType }) {
    return <View>
        <View
            className={"flex flex-row px-4 py-1"}>
            <Feature url={require("./../../assets/images/calendar.png")} title={"age"}
                     value={`${props.pet.age} Years`}/>
            <Feature url={require("../../assets/images/weight.png")} title={"weight"} value={`${props.pet.weight} KG`}/>
        </View>
        <View
            className={"flex flex-row px-4 py-1"}>
            <Feature url={require("../../assets/images/bone.png")} title={"breed"} value={`${props.pet.breed}`}/>
            <Feature url={require("../../assets/images/gender-fluid.png")} title={"age"} value={`${props.pet.gender}`}/>
        </View>
    </View>;
}

function AboutPet(props: { pet: petType }) {
    const [readMore, setReadMore] = useState<boolean>(false);
    const onPress = () => {
        setReadMore(!readMore)
    }
    return <View className={"px-8 py-4"}>
        <Text className={"font-bold"}>
            About {props.pet.name}
        </Text>
        <Text numberOfLines={readMore ? 999 : 3}
              onTextLayout={t => {
                  t.nativeEvent.lines.length < 3 && setReadMore(true)
              }}
              className={"text-gray-500"}>
            {props.pet.basicInfo}
        </Text>
        {!readMore && <Pressable onPress={onPress}>
            <Text className={"text-blue-500 underline"}>
                Read More
            </Text>
        </Pressable>
        }

    </View>;
}

function OwnerDetails(props: { pet: petType }) {
    return <View
        className={"px-5 mx-5 mb-32 py-2.5 items-center justify-between  flex flex-row bg-white border rounded-2xl "}>
        <View className={"flex flex-row"}>
            <Image source={{
                uri: props.pet.ownerImageUrl,
            }} className={" rounded-full size-50"}></Image>
            <View className={"px-2"}>
                <Text className={"text-xl font-bold "}>
                    {props.pet.ownerName}
                </Text>
                <Text>
                    {props.pet.designation}
                </Text>
            </View>
        </View>
        <Ionicons name={"send"}
                  size={25}
                  color={CONSTANT.Colors.primary}
        />
    </View>;
}

interface AdoptMeBtnProps {
    pet?: petType
}

function AdoptMeBtn({pet}: AdoptMeBtnProps) {
    const {user} = useUser()
    const router = useRouter()
    const initiateChat = async () => {
        const userEmail = user?.primaryEmailAddress?.emailAddress
        if (userEmail === pet?.email) {
            return Alert.alert("You can't adopt your own pet")

        }
        const docID1 = `${userEmail}_${pet?.email}`
        const docID2 = `${pet?.email}_${userEmail}`

        const q = query(collection(db, 'Chats'), where('id', 'in', [docID1, docID2]))
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) {
            await setDoc(doc(db, 'Chats', docID1), {
                id: docID1,
                users: [{
                    email: userEmail,
                    imageUrl: user?.imageUrl,
                    name: user?.fullName
                }, {
                    email: pet?.email,
                    imageUrl: pet?.ownerImageUrl,
                    name: pet?.ownerName
                }],
                userIds:[userEmail,pet?.email]
            })
            router.push({
                pathname: "/Chat",
                params: {
                    id: docID1
                }
            })
        }else{
            router.push({
                pathname: "/Chat",
                params: querySnapshot.docs.map(docs => docs.data()).at(0)
            })
        }


    }
    return <TouchableOpacity
        onPress={initiateChat}
        className={"bg-primary h-[9vh] flex justify-center items-center absolute w-full  bottom-0"}>
        <Text className={"capitalize font-bold text-lg"}>
            Adopt Me
        </Text>
    </TouchableOpacity>;
}

const PetDetails = () => {
    const pet = useLocalSearchParams() as unknown as petType


    return <ScrollView className={""}
    >
        <StatusBar style={'auto'}/>
        <Image source={{
            uri: pet.imageUrl,
        }} className={"h-[45vh] w-full object-contain"}
        />
        <PetName pet={pet}/>
        <PetFeatures pet={pet}/>
        <AboutPet pet={pet}/>
        <OwnerDetails pet={pet}/>

        <AdoptMeBtn pet={pet}/>
    </ScrollView>
}
export default PetDetails
