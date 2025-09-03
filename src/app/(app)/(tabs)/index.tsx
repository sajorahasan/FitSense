import Stack, { VStack } from '@nkzw/stack';
import { Stack as ExpoStack } from 'expo-router';
import { View } from 'react-native';
import Text from 'src/ui/Text.tsx';

export default function Index() {
  return (
    <>
      <ExpoStack.Screen options={{ title: 'Home' }} />
      <VStack alignCenter center flex1 gap={16} padding>
        <Text className="text-center text-xl font-bold color-purple">
          <Text>Welcome</Text>
        </Text>
        <Text className="text-center italic">
          <Text>Modern, sensible defaults, fast.</Text>
        </Text>
        <Stack alignCenter center gap={4}>
          <Text className="text-center">
            Change{' '}
            <View className="border-hairline translate-y-[8px] rounded border-purple bg-grey p-1">
              <Text>src/app/(app)/(tabs)/index.tsx</Text>
            </View>{' '}
            for live updates.
          </Text>
        </Stack>
      </VStack>
    </>
  );
}
