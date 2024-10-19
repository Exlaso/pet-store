import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {useLocalSearchParams, useNavigation} from "expo-router";
import {addDoc, collection, doc, getDoc, onSnapshot} from "@firebase/firestore";
import {db} from "@/firebase.config";
import {useUser} from "@clerk/clerk-expo";
import {GiftedChat, IMessage} from "react-native-gifted-chat";
import {format} from "date-fns/format";
import moment from "moment";
export type ChatTypeUsers = {
    email: string,
    imageUrl: string,
    name: string
}
export type ChatType = {
    id: string,
    users?: ChatTypeUsers[],
    userIds?: string[]
}
const ChatScreen = () => {
    const params = useLocalSearchParams() as unknown as ChatType
const {user} = useUser()
    const navigation = useNavigation()
    const [messages, setMessages] = useState<IMessage[]>([]);
        const userEmail = user?.primaryEmailAddress?.emailAddress
    const getUserInformation = async () => {
        const docRef = await getDoc(doc(db, "Chats", params.id));
        const data = docRef.data() as ChatType
        console.log({data})
        const receiverUser = data.users?.find(user => user.email !== userEmail)
        navigation.setOptions({
            headerTitle: receiverUser?.name,
        })
    }
    useEffect(() => {
        getUserInformation()
        const unsubscribe = onSnapshot(collection(db, "Chats", params.id, 'Messages'), (querySnapshot) => {
            const FBmessages = querySnapshot.docs.map(doc => {
                return {
                    _id:doc.id  ,
                    ...doc.data(),
                } as IMessage
            })
            setMessages(FBmessages)
        })
        return () => unsubscribe()
    }, [])
    return <View className={"flex-1 py-10"}>
        <GiftedChat
            messages={messages}
            showUserAvatar={true}
            onSend={async message => {
                setMessages(previousMessages => GiftedChat.append(previousMessages, message))
                message[0].createdAt = moment().format('MM-DD-YYYY HH-mm-ss') as any
                await addDoc(collection(db, "Chats", params.id, 'Messages'), message.at(0))
            }}
            infiniteScroll={true}
            user={{
                name: user?.fullName ?? "",
                _id: userEmail ?? "",
                avatar: user?.imageUrl
            }}

        />
    </View>
}
export default ChatScreen;