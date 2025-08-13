import { COLORS } from '@/src/constants/theme';
import { Stack } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: -insets.bottom, backgroundColor: COLORS.primary }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}
