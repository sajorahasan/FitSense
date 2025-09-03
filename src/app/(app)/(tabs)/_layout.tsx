import _AntDesign from '@expo/vector-icons/AntDesign.js';
import { Tabs } from 'expo-router';
import { FC } from 'react';
import colors from 'src/ui/colors.ts';

// Types in `@expo/vector-icons` do not currently work correctly in `"type": "module"` packages.
const AntDesign = _AntDesign as unknown as FC<{
  color: string;
  name: string;
  size: number;
}>;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: 'transparent',
        },
        tabBarActiveTintColor: colors.purple,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <AntDesign
              color={focused ? colors.purple : colors.black}
              name="ie"
              size={24}
            />
          ),
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <AntDesign
              color={focused ? colors.purple : colors.black}
              name="printer"
              size={24}
            />
          ),
          title: 'Two',
        }}
      />
    </Tabs>
  );
}
