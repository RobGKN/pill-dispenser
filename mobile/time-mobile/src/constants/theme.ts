import { MD3LightTheme as DefaultTheme, MD3Theme } from 'react-native-paper';

export const theme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6750A4',   // Material baseline indigo‑40
    secondary: '#625B71', // baseline purple‑40
    tertiary: '#7D5260',
  },
};