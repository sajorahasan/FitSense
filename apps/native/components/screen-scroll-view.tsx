import { useHeaderHeight } from "@react-navigation/elements";
import type { FC, PropsWithChildren } from "react";
import { Platform, type ScrollViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { cn } from "@/lib/utils";

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

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
  const headerHeight = useHeaderHeight();
  return (
    <AnimatedKeyboardAwareScrollView
      className={cn("bg-background", className)}
      contentContainerClassName={cn("px-5", contentContainerClassName)}
      contentContainerStyle={{
        paddingTop: Platform.select({
          ios: headerHeight,
          android: 0,
        }),
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
      bottomOffset={50}
      extraKeyboardSpace={0}
      {...props}
    >
      {children}
    </AnimatedKeyboardAwareScrollView>
  );
};
