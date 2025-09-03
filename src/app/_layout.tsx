import 'global.css';
import { VStack } from '@nkzw/stack';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ViewerContext } from 'src/user/useViewerContext.tsx';

export const unstable_settings = {
  initialRouteName: '(app)',
};

export default function RootLayout() {
  return (
    <ViewerContext>
      <GestureHandlerRootView>
        <VStack flex1>
          <Slot />
        </VStack>
      </GestureHandlerRootView>
    </ViewerContext>
  );
}
