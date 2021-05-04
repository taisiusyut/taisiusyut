import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Schema$Book } from '@/typings';
import { Text } from '@/components/Text';
import { shadow } from '@/styles';
import dayjs from 'dayjs';

export interface FeaturedItemProps {
  book: Schema$Book;
  style?: ViewStyle;
}

export function FeaturedItem({ book, style }: FeaturedItemProps) {
  return (
    <View style={[styles.item, style]}>
      <Text>{book.name}</Text>
      <Text>{book.authorName} 著</Text>
      {book.lastPublishedAt && (
        <Text>上次更新: {dayjs(book.lastPublishedAt).fromNow()}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    ...shadow(2, { shadowOffsetY: 5 }),
    backgroundColor: `#fff`,
    width: 240,
    padding: 15,
    borderRadius: 5
  }
});
