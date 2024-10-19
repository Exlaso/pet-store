import {doc, getDoc, setDoc, updateDoc} from "@firebase/firestore";
import {db} from "@/firebase.config";
export type getFavouriteListType = {
    emailAddress: string
    favourites: string[]
}

export const getFavouriteList = async (emailAddress: string | undefined):Promise<{
    emailAddress: string
    favourites: string[]
} | undefined | void> => {
    if (!emailAddress) {
        return
    }
    const docSnap = await getDoc(doc(db, "FavouritePet", emailAddress));
    if (docSnap.exists()) {
        return docSnap.data() as getFavouriteListType
    } else {
        return setDoc(doc(db, "FavouritePet", emailAddress), {
            emailAddress,
            favourites: []
        })
}
}


export const  updateFavouriteList = async (emailAddress: string | undefined, favourites: string[]):Promise<void> => {
    try {
        if (!emailAddress) {
            return
        }
        await updateDoc(doc(db, "FavouritePet", emailAddress), {
            favourites
        })
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message)
        }
    }
}