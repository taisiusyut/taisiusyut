import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Button } from '../components/Button';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Button />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
});
