import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    KeyboardTypeOptions,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {CONSTANT} from "@/constants";
import {z} from "zod";
import {useState} from "react";
import {Picker} from "@react-native-picker/picker";
import {ImagePickerAsset, launchImageLibraryAsync, MediaTypeOptions} from "expo-image-picker";
import {db, storage} from "@/firebase.config";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {doc, setDoc} from "@firebase/firestore";
import {petType} from "@/app/(tabs)/home";
import {useUser} from "@clerk/clerk-expo";
import {useRouter} from "expo-router";

export type ZodObjectOrWrapped =
    | z.ZodObject<any, any>
    | z.ZodEffects<z.ZodObject<any, any>>;

const Input = ({
                   label,
                   onChange,
                   value,
                   numberOfLines,
                   error, keyboardType
               }: {
    label: string,
    onChange: (value: string) => void,
    value: string | undefined | number,
    numberOfLines?: number,
    error?: string | undefined,
    keyboardType?: KeyboardTypeOptions
}) => {
    return <View className={"flex flex-col gap-2 "}>
        <Text className={"capitalize"}
        >
            {label}
        </Text>
        <TextInput
            numberOfLines={numberOfLines}
            value={value?.toString()}
            onChange={(e) => onChange(e.nativeEvent.text)}
            className={"bg-white rounded-lg p-3"}
            placeholder={label}
            keyboardType={keyboardType}
        />
        <Text className={"text-sm text-red-500"}>{error && error?.length > 2 && error}</Text>
    </View>
}

const initial = {
    name: undefined,
    category: undefined,
    age: undefined,
    breed: undefined,
    address: undefined,
    gender: undefined,
    About: undefined,
    weight: undefined

}
export default function AddNewPet() {
    const {user} = useUser()
    const [input, setInput] = useState<schemaType>({
        name: undefined,
        category: undefined,
        age: undefined,
        breed: undefined,
        address: undefined,
        gender: undefined,
        About: undefined,
        weight: undefined

    });
    type schemaType = {
        name: string | undefined,
        category: "Dog" | "Cat" | "Bird" | "Rabbit" | undefined,
        age: number | undefined,
        breed: string | undefined,
        address: string | undefined,
        gender: "MALE" | "FEMALE" | undefined,
        weight: number | undefined,
        About: string | undefined,

    }
    const updateInput = (key: keyof schemaType, value: string) => {
        return setInput({
            ...input,
            [key]: value
        } as any)
    }
    const petCategory = ['Dog', "Cat", "Bird", 'Rabbit']
    const [petImage, setPetImage] = useState<ImagePickerAsset>(require('../../assets/images/paws.png'));
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter()
    const handleSubmit = async () => {
        setLoading(true)
        if (JSON.stringify(initial) === JSON.stringify(input)) {
            Alert.alert("Please fill all the fields")
            console.error("Please fill all the fields")
            setLoading(false)
        } else {
            try {
                if (require('../../assets/images/paws.png') === petImage) {
                    Alert.alert("Please add an image")
                    console.error("Please add an image")
                }
                const url = await fetch(petImage.uri)
                const blobImage = await url.blob()
                const storageRef = ref(storage, '/PetAdopt' + new Date().getTime() + ".jpg")
                await uploadBytes(storageRef, blobImage)
                const downloadURL = await getDownloadURL(storageRef)
                const docId = new Date().getTime().toString()

                const pet = {
                    id: docId,
                    gender: input.gender ?? "Unknown"
                    , age: input.age ?? "Unknown"
                    , breed: input.breed ?? "Unknown"
                    , name: input.name ?? "Unknown"
                    , weight: input.weight ?? "Unknown"
                    , category: (input.category + "s") ?? "Unknown"
                    , basicInfo: input.About ?? "No Information"
                    , designation: "Pet Owner"
                    , ownerName: user?.fullName ?? "Unknown"
                    , imageUrl: downloadURL
                    , email: user?.primaryEmailAddress?.emailAddress ?? "Unknown"
                    , ownerImageUrl: user?.imageUrl ?? 'https://avatar.iran.liara.run/public/43'
                    , streetAddress: input.address ?? "Unknown"
                } satisfies petType
                await setDoc(doc(db, "Pets", docId), pet)
                router.push({
                    params: pet,
                    pathname: "/pet-details"
                })
            } catch (error) {
                if (error instanceof Error) {
                    console.error(JSON.stringify(error))

                }
            }
            setLoading(false)


        }
    }

    return <SafeAreaView className={"flex-1"}>
        <KeyboardAvoidingView
            className={"flex-1"}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView className={"flex-1 py-14 px-5"}
                        keyboardDismissMode={"on-drag"}

            >


                <Text className={"text-2xl font-bold"}>
                    Add New Pet for Adoption
                </Text>
                <TouchableOpacity
                    className={"my-5"}
                    onPress={async () => {
                        const result = await launchImageLibraryAsync({
                            allowsMultipleSelection: false,
                            mediaTypes: MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [4, 3],
                        });
                        if (!result.canceled) {
                            setPetImage(result.assets?.at(0) as any)
                        }
                    }}
                >
                    <Text className={"text-sm"}>
                        Add Image by clicking here
                    </Text>

                    <Image source={petImage}
                           className={" size-100 rounded-lg    "}
                           style={{
                               borderWidth: 1,
                               borderColor: CONSTANT.Colors.primary,
                               padding: 100,
                           }}
                    />
                </TouchableOpacity>
                <Input label={"Name"} onChange={e => updateInput('name', e)} value={input?.name}/>
                <Text>Category</Text>

                <Picker selectedValue={input?.category} onValueChange={e => updateInput("category", e)}>
                    {petCategory.map(cat => (
                        <Picker.Item label={cat} value={cat} key={cat}/>
                    ))}
                </Picker>
                <Input label={"Age"} onChange={e => updateInput('age', e)} value={input?.age} keyboardType={"numeric"}/>
                <Text>Gender</Text>
                <Picker selectedValue={input?.gender} onValueChange={e => updateInput("gender", e)}>
                    <Picker.Item label={"Male"} value={'MALE'}/>
                    <Picker.Item label={"Female"} value={'FEMALE'}/>
                </Picker>
                <Input label={"Breed"} onChange={e => updateInput('breed', e)} value={input?.breed}/>
                <Input label={"Weight"} onChange={e => updateInput('weight', e)} value={input?.weight}
                       keyboardType={"numeric"}/>
                <Input label={"Address"} onChange={e => updateInput('address', e)} value={input?.address}/>
                <Input label={"About"} onChange={e => updateInput('About', e)} value={input?.About} numberOfLines={5}/>

                {loading ? <ActivityIndicator size={'large'}/> : <TouchableOpacity
                    onPress={handleSubmit}
                >

                    <Text className={"bg-primary text-white rounded-lg p-3 text-center"}>
                        Add Pet
                    </Text>

                </TouchableOpacity>}
                <View className={"py-20"}/>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
}