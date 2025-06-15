import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeviceSummary from '../screens/DeviceSummary';
import DeviceSettings from '../screens/DeviceSettings';
import DayDetail from '../screens/DayDetail';
import AddDose from '../screens/AddDose';

export type DeviceParamList = {
  Summary:  { id: string };
  Settings: { id: string };
  Day:      { id: string; date: string };
};

const Stack = createNativeStackNavigator<DeviceParamList>();

export default function DeviceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Summary"  component={DeviceSummary} options={{ title: 'Summary' }} />
      <Stack.Screen name="Settings" component={DeviceSettings}                           />
      <Stack.Screen name="Day"      component={DayDetail} options={({ route }) => ({ title: route.params.date })} />
      <Stack.Screen name="AddDose" component={AddDose} options={{ title: 'Add Dose' }} />
      <Stack.Screen name="DayDetail" component={DayDetail} options={{ title: 'Day Detail' }} />
    </Stack.Navigator>
  );
}
