import { useState } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';

type InputProps = {
  text: string;
  onChange?: (text: string) => void;
};

export default function licensePlateInput({ text, onChange }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [setText, setSetText] = useState('');

  const styles = StyleSheet.create({
    input: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: 'black',
      textAlign: 'left',
      backgroundColor: '#fff',
      borderStyle: 'solid',
      borderColor: isFocused ? '#335ab3' : '#e5e5e5',
      borderBottomWidth: 6,
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 6,
      paddingTop: 5,
      paddingBottom: 5,
      marginVertical: 8,
      textAlignVertical: 'center',
      maxHeight: 50,
      minWidth: '100%',
    },
    dkTypo: {
      textAlign: 'right',
      fontFamily: 'Inter-Bold',
      fontWeight: '700',
      fontSize: 16,
    },
    licenseNo: {
      color: '#000',
      textAlign: 'right',
      fontFamily: 'Inter-Bold',
      fontWeight: '700',
      fontSize: 16,
    },
    licenseNoWrapper: {
      paddingHorizontal: 6,
      textAlign: 'left',
    },
    dk: {
      color: '#fff',
    },
    dkWrapper: {
      borderTopLeftRadius: 3,
      borderBottomLeftRadius: 3,
      backgroundColor: '#335ab3',
      paddingHorizontal: 4,
      height: '100%',
      width: 55,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    licenseContainer: {
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      width: '100%',
      height: 40,
      overflow: 'hidden',
    },
    frameFlexBox: {
      alignItems: 'center',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      margin: 0,
    },
  });

  const handleChange = (input: string) => {
    // Only allow up to 2 letters followed by up to 4 digits
    const upperInput = input.toUpperCase();

    // Match partial valid inputs while typing
    if (/^[A-Z]{0,2}\d{0,4}$/.test(upperInput)) {
      setSetText(upperInput);
    }
  };

  return (
    <View>
      <View style={[styles.licenseContainer, styles.frameFlexBox]}>
        <View style={styles.dkWrapper}>
          <Text style={[styles.dk, styles.dkTypo]}>DK</Text>
        </View>
        <View style={[styles.licenseNoWrapper]}>
          <TextInput
            multiline={false}
            style={styles.input}
            value={text}
            onChangeText={onChange}
            placeholder="AB1234"
            placeholderTextColor="#e5e5e5"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={6}
            autoCapitalize="characters"
          />
        </View>
      </View>
    </View>
  );
}
