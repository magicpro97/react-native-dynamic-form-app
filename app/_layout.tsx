import { Stack } from 'expo-router';
import { SyncProvider } from '../src/context/SyncContext';
import { ToastProvider } from '../src/context/ToastContext';

export default function RootLayout() {
  return (
    <ToastProvider>
      <SyncProvider>
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
          <Stack.Screen 
            name="validation-demo" 
            options={{ 
              title: 'Validation Demo',
              headerShown: true,
              headerBackTitle: 'Back'
            }} 
          />
        </Stack>
      </SyncProvider>
    </ToastProvider>
  );
}
