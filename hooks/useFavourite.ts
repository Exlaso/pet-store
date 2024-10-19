import {create} from 'zustand'
import {getFavouriteList, updateFavouriteList} from "@/lib/shared";

type useFavouriteType = {
    favourites: string[]
    email: string | undefined
    getFavourites: (email: string | undefined) => void
    removeFavorite: (petID: string) => void
    addFavorite: (petID: string) => void
}
export const useFavourite = create<useFavouriteType>((set, getState) => ({
    favourites: [],
    email: undefined,
    getFavourites: async (email: string | undefined) => {
        const favList = await getFavouriteList(email)
        set({favourites: favList?.favourites ?? [],email: email})

    },
    removeFavorite: (petID: string) => {
        const {favourites,email} = getState()
        const newFav = favourites.filter(fp => fp !== petID)
        updateFavouriteList(email, newFav).then()
        set({favourites: newFav})
    },
    addFavorite: (petID: string) => {
        const {favourites,email} = getState()
        const newFav = [...favourites, petID]
        updateFavouriteList(email, newFav).then()
        set({favourites: newFav})
    }
}))
