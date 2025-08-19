import { COLORS } from "@/src/constants/theme";
import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { KeyboardTypeOptions, StyleProp, View, ViewStyle } from "react-native";
import { HelperText, TextInput, TextInputProps } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface InputProps<T extends FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T, any, T>;
  label: string;
  icon: IconSource;
  type: KeyboardTypeOptions | "password";
  outerStyle?: StyleProp<ViewStyle>;
  errorText?: string;
}

export default function Input<T extends FieldValues>({
  name,
  control,
  label,
  icon,
  type,
  error,
  errorText,
  outerStyle,
  ...rest
}: InputProps<T>) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={outerStyle}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            left={<TextInput.Icon icon={icon} color={COLORS.primary} />}
            right={
              type === "password" ? (
                <TextInput.Icon
                  icon={secureTextEntry ? "eye" : "eye-off"}
                  onPress={() => setSecureTextEntry((value) => !value)}
                />
              ) : null
            }
            label={label}
            placeholder={`Type ${label.toLowerCase()}`}
            keyboardType={type === "password" ? undefined : type}
            secureTextEntry={type === "password" && secureTextEntry}
            outlineStyle={{
              borderWidth: 2,
              borderRadius: 10,
            }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...rest}
          />
        )}
      />
      {error && <HelperText type="error">{errorText}</HelperText>}
    </View>
  );
}
