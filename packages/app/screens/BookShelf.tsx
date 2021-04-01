import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function BookShelf() {
  return (
    <View style={styles.container}>
      <Text>BookShelf</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  }
});
