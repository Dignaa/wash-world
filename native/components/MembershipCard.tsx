import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CardProps = {
  membershipType: string;
  price: number;
  licensePlate: string;
};

export default function MembershipCard({
  membershipType,
  price,
  licensePlate,
}: CardProps) {
  return (
    <SafeAreaView style={styles.card}>
      <View style={[styles.frameGroup, styles.frameFlexBox]}>
        <View style={styles.brilliantParent}>
          <Text style={[styles.membership, styles.membershipTypo]}>
            {membershipType}
          </Text>
          <Text style={[styles.price, styles.membershipTypo]}>
            {price} kr./mnd
          </Text>
        </View>
        <View style={[styles.licenseContainer, styles.frameFlexBox]}>
          <View style={styles.dkWrapper}>
            <Text style={[styles.dk, styles.dkTypo]}>DK</Text>
          </View>
          <View style={[styles.licenseNoWrapper]}>
            <Text style={[styles.licenseNo, styles.dkTypo]}>
              {licensePlate}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  membershipTypo: {
    textAlign: 'left',
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  frameFlexBox: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dkTypo: {
    textAlign: 'right',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 16,
  },
  membership: {
    fontSize: 18,
  },
  price: {
    fontSize: 14,
  },
  brilliantParent: {
    gap: 4,
    justifyContent: 'center',
    height: 50,
    paddingVertical: 10,
  },
  dk: {
    color: '#fff',
  },
  dkWrapper: {
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    backgroundColor: '#335ab3',
    width: 30,
    paddingHorizontal: 4,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  licenseNo: {
    color: '#000',
    textAlign: 'right',
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    fontSize: 16,
  },
  licenseNoWrapper: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    paddingHorizontal: 6,
    textAlign: 'left',
  },
  licenseContainer: {
    borderRadius: 4,
    borderColor: '#ff0000',
    borderWidth: 0.5,
    width: 95,
    height: 35,
    borderStyle: 'solid',
  },
  frameGroup: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  card: {
    borderRadius: 6,
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderStyle: 'solid',
    alignSelf: 'stretch',
    gap: 0,
  },
});
