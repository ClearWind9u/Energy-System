import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../navigation/ThemeContext";

export default function HomeScreen({navigation}) {


  const {isDayMode, setIsDayMode} = useTheme();
  const currentStyles = isDayMode ? dayModeStyles : nightModeStyles;

  return (
    <View style={[styles.container, currentStyles.container]}>
      {/* Header */}
      <View style={[styles.header, currentStyles.container]}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
          <FontAwesome name="arrow-left" size={24} color={currentStyles.text.color} />
        </TouchableOpacity>

        <Text style={[styles.title, currentStyles.text]}>Trang chủ</Text>
        <TouchableOpacity style={styles.iconButton} > 
          <FontAwesome name="bell" size={24} color={currentStyles.text.color}/>
        </TouchableOpacity>
      </View>

      {/* Chế độ ban ngày */}
      <View style={[styles.modeContainer, currentStyles.modeContainer]}>
        <FontAwesome name="sun-o" size={24} color={isDayMode? "black" : "white"} />
        <Text style={[styles.modeText, currentStyles.text]}>{isDayMode? "Chế độ ban ngày" : "Chế độ ban đêm"}</Text>
        <Switch
          value={isDayMode}
          onValueChange={() => setIsDayMode(!isDayMode)}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
          thumbColor="white"
        />
      </View>

      {/* Các ô chức năng */}
      <View style={styles.grid}>
        <TouchableOpacity style={[styles.card, { backgroundColor: "#FF7070" }]}  onPress={() => navigation.navigate("Detail")}    >
          <FontAwesome name="eye" size={24} color="black" />TE
          <Text style={[styles.cardText]}>Theo dõi mức tiêu thụ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: "#A4FF80" }]} onPress={ () => navigation.navigate("Adjust")}    >
          <FontAwesome name="cog" size={24} color="black" />
          <Text style={[styles.cardText]}>Điều chỉnh mức tiêu thụ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: "#708DFF" }]}>
          <FontAwesome name="tablet" size={24} color="black" />
          <Text style={[styles.cardText]}>Quản lí thiết bị</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: "#FFE970" }]} >
          <FontAwesome name="line-chart" size={24} color="black" />
          <Text style={[styles.cardText]}>Báo cáo và phân tích</Text>
        </TouchableOpacity>
      </View>

      {/* Thanh điều hướng */}
      <View style={[styles.bottomNav, currentStyles.bottomNav]}>
        <TouchableOpacity style={styles.navButton}>
          <MaterialCommunityIcons name="view-dashboard" size={24} color="white" />
          <Text style={styles.navText}>Bảng điều khiển</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <MaterialCommunityIcons name="microphone" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton}>
          <MaterialCommunityIcons name="account" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: { 
    padding: 10, 
    // position: "absolute", 
    left: 0 
  },
  title: {
    paddingLeft:5,
    // position: "absolute", 
    fontSize: 24,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 10,
  },
  modeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 10,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modeText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  cardText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "black",
    paddingVertical: 15,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  }
});

const dayModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "white",
  },
  text: {
    color: "black",
  },
  modeContainer: {
    backgroundColor: "#F2F2F2",
  },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  bottomNav: {
    backgroundColor: "black",
  },
});

// Style cho chế độ ban đêm
const nightModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
  },
  header: {
    backgroundColor: "#2C2C2C",
  },
  text: {
    color: "white",
  },
  modeContainer: {
    backgroundColor: "#333",
  },
  card: {
    backgroundColor: "#444",
  },
  bottomNav: {
    backgroundColor: "#333",
  },
});

