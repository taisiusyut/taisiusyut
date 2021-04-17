import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRxAsync } from 'use-rx-hooks';
import { Schema$Book } from '@/typings';
import { Text } from '@/components/Text';
import { FeaturedItem } from './FeaturedItem';

export interface FeaturedSectionProps {
  title: string;
  request: () => Promise<Schema$Book[]>;
}

export function FeaturedSection({ title, request }: FeaturedSectionProps) {
  const [{ data: books = [] }] = useRxAsync(request);

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        style={styles.scroller}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.items}>
          {books.map((book, idx) => (
            <FeaturedItem
              key={book.id}
              book={book}
              style={idx === 0 ? {} : { marginLeft: 14 }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const containerPadding = 20;
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 7
  },
  scroller: {
    marginHorizontal: -containerPadding
  },
  items: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: containerPadding
  }
});
