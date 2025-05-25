import { Link, LinkProps } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';

type ButtonProps = {
  link?: LinkProps['href'];
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function SecondaryButton({
  link,
  title,
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  // If a link is provided, wrap with expo-router’s Link
  if (link) {
    return (
      <Pressable
        onPress={() => {}}
        style={[styles.button, style]}
        // Link itself handles navigation—instead of using onPress here you can wrap the Text in a Link
      >
        <Link href={link} style={styles.link}>
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </Link>
      </Pressable>
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
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    borderBottomWidth: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E5E5',
    color: 'black',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  text: {
    color: 'black',
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
