import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { DeviceProvider } from '../contexts/DeviceContext';
import Home from '../screens/Home';
import AddDispenser from '../screens/AddDispenser';
import DeviceStack from './DeviceStack';

const Stack = createNativeStackNavigator();
const Tabs  = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="HomeTab" component={Home} options={{ title: 'Home' }} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <DeviceProvider>
          <NavigationContainer theme={DefaultTheme}>
            <Stack.Navigator>
              <Stack.Screen name="Root"    component={TabsNavigator} options={{ headerShown: false }} />
              <Stack.Screen name="AddDisp" component={AddDispenser}  options={{ presentation: 'modal', title: 'Add Dispenser' }} />
              <Stack.Screen name="Device"  component={DeviceStack}   options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </DeviceProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
