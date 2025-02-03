import {FlatList, Image, Text, View} from "react-native";
import {useUser} from "@clerk/clerk-expo";
import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "@/firebase.config";
import {useEffect, useState} from "react";
import {ChatType, ChatTypeUsers} from "@/app/Chat";
import {Link} from "expo-router";


function InboxChat({item}: {
    item: OtherUserType
}) {
    return <Link href={'/Chat?id='+item.docId as any} className={"flex-col "}>
        <View className={"flex-row gap-2.5 items-center"}>
            <Image source={{uri: item.imageUrl}} className={"rounded-full w-10 h-10"}></Image>
            <Text className={"text-lg"}> {item.name}</Text>
        </View>
        <View className={" w-full my-4 border-b-gray-300 "}

              style={{
                  borderBottomWidth: 1,
              }}>

        </View>
    </Link>;
}

type OtherUserType = (ChatTypeUsers & {
    docId: string
})
export default function Profile() {
    const {user} = useUser()
    const [userList, setUserList] = useState<ChatType[]>([]);
    const userEmail = user?.primaryEmailAddress?.emailAddress
    const [loading, setLoading] = useState<boolean>(false);
    const getUserList = async () => {
        setLoading(true)
        const q = query(collection(db, 'Chats'), where('userIds', 'array-contains', userEmail))
        const querySnapshot = await getDocs(q)
        setUserList(querySnapshot.docs.map(doc => doc.data() as ChatType))
        setLoading(false)
    }

    const otherUsers = (): OtherUserType[] => {
        return userList.map(chat => {
            const otherUser = chat.users?.filter(user => user.email !== userEmail)
            return ({
                docId: chat.id,
                email: otherUser?.at(0)?.email ?? "",
                name: otherUser?.at(0)?.name ?? "",
                imageUrl: otherUser?.at(0)?.imageUrl ?? ""
            })
        });
    }
    useEffect(() => {
        getUserList()
    }, [user])
    const a = otherUsers()
    return <View className={"py-5  mt-5"}>
        <Text className={"text-bold p-5 text-3xl"}>
            Inbox
        </Text>
        <FlatList data={otherUsers()}
                  refreshing={loading}
                  onRefresh={getUserList}
                  contentContainerStyle={{
                      gap: 10,
                      paddingHorizontal: 20
                  }}
                  className={"py-10  h-full"}
                  renderItem={item => {
                      return <InboxChat item={item.item}/>
                  }}/>

    </View>
}