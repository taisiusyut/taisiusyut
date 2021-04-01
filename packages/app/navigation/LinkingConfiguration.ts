import * as Linking from 'expo-linking';

export const LinkingConfiguration = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          BookShelf: {
            screens: {
              BookShelfScreen: 'one'
            }
          },
          Featured: {
            screens: {
              FeaturedScreen: 'two'
            }
          },
          Search: {
            screens: {
              Search: 'two'
            }
          }
        }
      },
      NotFound: '*'
    }
  }
};
