import Ionicons from "@expo/vector-icons/build/Ionicons";
import { TextField, useTheme } from "heroui-native";
import { useState } from "react";
import { Pressable } from "react-native";

interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
}

export default function PasswordField({
  value,
  onChangeText,
  placeholder = "Enter your password",
  isRequired = false,
  className = "rounded-3xl",
}: PasswordFieldProps) {
  const { colors } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <TextField isRequired={isRequired}>
      <TextField.Input
        className={className}
        placeholder={placeholder}
        secureTextEntry={!isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
      >
        <TextField.InputStartContent className="pointer-events-none">
          <Ionicons
            name="lock-closed-outline"
            size={16}
            color={colors.mutedForeground}
          />
        </TextField.InputStartContent>
        <TextField.InputEndContent>
          <Pressable onPress={togglePasswordVisibility} className="p-1">
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>
        </TextField.InputEndContent>
      </TextField.Input>
    </TextField>
  );
}
