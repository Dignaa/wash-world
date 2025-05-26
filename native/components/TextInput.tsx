import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

type InputProps = {
  text: string | undefined;
  placeholder: string;
  onChange?: (text: any) => void;
  secureTextEntry?: boolean;
};

export default function CustomTextInput({
  text,
  onChange,
  placeholder,
  secureTextEntry,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const styles = StyleSheet.create({
    input: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: 'black',
      textAlign: 'left',
      backgroundColor: '#fff',
      borderStyle: 'solid',
      borderColor: isFocused ? '#198B47' : '#e5e5e5',
      borderBottomWidth: 6,
      flex: 1,
      width: '100%',
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 6,
      paddingTop: 5,
      paddingBottom: 5,
      marginVertical: 8,
      textAlignVertical: 'center',
      maxHeight: 50,
    },
  });

  return (
    <TextInput
      multiline={false}
      style={styles.input}
      value={text}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}
