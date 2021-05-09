import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Schema$Book } from '@/typings';
import { Text } from '@/components/Text';
import { makeStyles, shadow } from '@/styles';
import dayjs from 'dayjs';

export interface FeaturedItemProps {
  book: Schema$Book;
  style?: ViewStyle;
}

const useStyles = makeStyles(theme => ({
  item: {
    ...shadow(1, { shadowOffsetY: 3 }),
    backgroundColor: theme.secondary,
    width: 240,
    padding: 15,
    borderRadius: 5
  }
}));

export function FeaturedItem({ book, style }: FeaturedItemProps) {
  const styles = useStyles();
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
