import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import AdjustComsumption from "../screens/AdjustComsumtion";
import DetailedSpecification from "../screens/DetailedSpecification";
import DeviceManagement from "../screens/DeviceManagement";
import { ThemeProvider } from "./ThemeContext";
import AccountInfor from "../screens/AccountInfor";
import ReportScreen from "../screens/ReportScreen";
import ChartScreen from "../screens/ChartScreen";
import Notification from "../screens/Notification";
import SensorGraph from "../screens/SensorGraph";

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
          <Stack.Screen name="Detail" component={DetailedSpecification} />
          <Stack.Screen name= "Sensor" component={SensorGraph} />
          <Stack.Screen name="DeviceManagement" component={DeviceManagement} />
          <Stack.Screen name="AccountInfor" component={AccountInfor} />
          <Stack.Screen name="Report" component={ReportScreen} />
          <Stack.Screen name="Chart" component={ChartScreen} />
          <Stack.Screen name="Notification" component={Notification} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
