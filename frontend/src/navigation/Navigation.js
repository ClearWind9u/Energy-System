import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import AdjustComsumption from "../screens/AdjustComsumtion";
import DeviceSrceen from "../screens/DeviceScreen";
import DetailedSpecification from "../screens/DetailedSpecification";
import DeviceManagement from "../screens/DeviceManagement";
import { ThemeProvider } from "./ThemeContext";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Adjust" component={AdjustComsumption} />
        <Stack.Screen name="device" component={DeviceSrceen} />
        <Stack.Screen name="Detail" component={DetailedSpecification} />
        <Stack.Screen name="DeviceManagement" component={DeviceManagement} />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}
