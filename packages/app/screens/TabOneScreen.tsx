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
      {/* <Button color="#2974FA" />
      <View style={{ margin: 5 }}></View>
      <Button color="#1983d8" />
      <View style={{ margin: 5 }}></View>
      <Button color="#d40e00" />
      <View style={{ margin: 5 }}></View>
      <Button color="#30404D" />
      <View style={{ margin: 5 }}></View>
      <Button color="#f5f8fa" /> */}
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
