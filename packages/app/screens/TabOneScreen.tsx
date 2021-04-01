import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Button } from '../components/Button';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Button intent="none" />
      <View style={{ margin: 5 }}></View>
      <Button intent="primary" />
      <View style={{ margin: 5 }}></View>
      <Button intent="danger" />
      <View style={{ margin: 5 }}></View>
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
