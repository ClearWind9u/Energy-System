import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    StyleSheet,
    StatusBar,
  } from "react-native";


export default function Test(){
    return (
        <View style={styles.container}>
            <Text> quang ly chill gà</Text>
            <StatusBar />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        height: 40,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom: 20,
    },
})