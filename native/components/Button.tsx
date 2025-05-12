import { Link, LinkProps } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

type ButtonProps = {
  link?: LinkProps['href'];
  title: string;
  onPress?: () => void;
};

export default function Button({ link, title, onPress }: ButtonProps) {
  const content = <Text style={styles.text}>{title}</Text>;

  if (link) {
    return (
      <Link href={link} style={styles.button}>
        {content}
      </Link>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.button}>
      {content}
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
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
