import { useHeaderHeight } from "@react-navigation/elements";
import type { FC, PropsWithChildren } from "react";
import { Platform, ScrollView, type ScrollViewProps } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface Props extends AnimatedProps<ScrollViewProps> {
  className?: string;
  contentContainerClassName?: string;
}

export const ScreenScrollView: FC<PropsWithChildren<Props>> = ({
  children,
  className,
  contentContainerClassName,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  return (
    <AnimatedScrollView
      className={cn("bg-background", className)}
      contentContainerClassName={cn("px-5", contentContainerClassName)}
      contentContainerStyle={{
        paddingTop: Platform.select({
          ios: headerHeight,
          android: 0,
        }),
        paddingBottom: insets.bottom + 32,
      }}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </AnimatedScrollView>
  );
};
