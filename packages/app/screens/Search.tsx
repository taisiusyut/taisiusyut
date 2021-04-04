import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Search() {
  return (
    <View style={styles.container}>
      <Text>Featured</Text>
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
