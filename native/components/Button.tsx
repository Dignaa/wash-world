import { Link, LinkProps } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';

type ButtonProps = {
  link?: LinkProps['href'];
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export default function Button({
  link,
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}: ButtonProps) {
  // If a link is provided, wrap with expo-router’s Link
  if (link) {
    return (
      <Link href={link} style={styles.button}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </Link>
    );
  }

  // Otherwise, normal pressable button
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        style,
      ]}
      disabled={disabled}
    >
      {!disabled ? (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      ) : (
        <ActivityIndicator size="small" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    backgroundColor: '#06C167',
    borderBottomColor: '#198B47',
    borderBottomWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  link: {
    // ensure the Link doesn’t override the Pressable layout
    width: '100%',
    textDecorationLine: 'none',
  },
});
