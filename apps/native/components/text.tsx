// import { cn } from "heroui-native";

import React from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cn } from "@/lib/utils";

export const Text = React.forwardRef<RNText, RNTextProps>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <RNText ref={ref} className={cn("font-normal", className)} {...restProps} />
  );
});

Text.displayName = "Text";
