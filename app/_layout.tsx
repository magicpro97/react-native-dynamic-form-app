import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Login',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="home" 
        options={{ 
          title: 'Home',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="form" 
        options={{ 
          title: 'Dynamic Form',
          headerShown: true,
          headerBackTitle: 'Back'
        }} 
      />
    </Stack>
  );
}
