import React, { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BookShelf } from '@/screens/BookShelf';
import { Featured } from '@/screens/Featured';
import { Search } from '@/screens/Search';
import {
  BottomTabParamList,
  BookShelfParamList,
  FeaturedParamList,
  SearchParamList
} from './routes';
import { colors } from '@/utils/color';
import { MainMenuNavigator } from './MainMenuNavigator';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

// const tabs:
// type T1 = ComponentProps<typeof BottomTab.Screen>;
const tabs: ComponentProps<typeof BottomTab.Screen>[] = [
  {
    name: 'BookShelf',
    component: BookShelfNavigator,
    options: {
      tabBarLabel: '書架',
      tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />
    }
  },
  {
    name: 'Featured',
    component: FeaturedNavigator,
    options: {
      tabBarLabel: '精選',
      tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />
    }
  },
  {
    name: 'Search',
    component: SearchNavigator,
    options: {
      tabBarLabel: '搜索',
      tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />
    }
  },
  {
    name: '_MainMenu',
    component: MainMenuNavigator,
    options: {
      tabBarLabel: '選項',
      tabBarIcon: ({ color }) => <TabBarIcon name="menu" color={color} />
    },
    listeners: ({ navigation }) => ({
      tabPress: e => {
        e.preventDefault();
        navigation.navigate('MainMenu');
      }
    })
  }
];

export function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="BookShelf"
      tabBarOptions={{ activeTintColor: colors.blue }}
    >
      {tabs.map(props => (
        <BottomTab.Screen key={props.name} {...props} />
      ))}
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
}) {
  return <Feather size={24} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const BookShelfStack = createStackNavigator<BookShelfParamList>();

function BookShelfNavigator() {
  return (
    <BookShelfStack.Navigator>
      <BookShelfStack.Screen
        name="BookShelfScreen"
        component={BookShelf}
        options={{ headerTitle: '書架' }}
      />
    </BookShelfStack.Navigator>
  );
}

const FeaturedStack = createStackNavigator<FeaturedParamList>();

function FeaturedNavigator() {
  return (
    <FeaturedStack.Navigator>
      <FeaturedStack.Screen
        name="FeaturedScreen"
        component={Featured}
        options={{ headerTitle: '精選' }}
      />
    </FeaturedStack.Navigator>
  );
}

const SearchStack = createStackNavigator<SearchParamList>();

function SearchNavigator() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchScreen"
        component={Search}
        options={{ headerTitle: '搜索' }}
      />
    </SearchStack.Navigator>
  );
}
