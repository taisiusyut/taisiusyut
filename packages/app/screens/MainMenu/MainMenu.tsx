import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function MainMenu() {
  return (
    <View style={styles.container}>
      <Text>MainMenu</Text>
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
