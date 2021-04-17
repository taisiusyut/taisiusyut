import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getBooks } from '@/service';
import { Order, Param$GetBooks } from '@/typings';
import { FeaturedSection, FeaturedSectionProps } from './FeaturedSection';

const _getBooks = (params?: Param$GetBooks) =>
  getBooks(params).then(response => response.data);

const sections: FeaturedSectionProps[] = [
  {
    title: '最近更新',
    request: () => _getBooks({ sort: { lastPublishedAt: Order.DESC } })
  }
];

export function Featured() {
  return (
    <View style={styles.container}>
      {sections.map(props => (
        <FeaturedSection {...props}></FeaturedSection>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  }
});
