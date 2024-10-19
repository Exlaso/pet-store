import {Platform,StatusBar, StyleSheet} from "react-native";

export const Container =  StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: StatusBar.currentHeight
    }
});