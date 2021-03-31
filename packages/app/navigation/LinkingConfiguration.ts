import * as Linking from 'expo-linking';

const LinkingConfig = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: 'one'
            }
          },
          TabTwo: {
            screens: {
              TabTwoScreen: 'two'
            }
          }
        }
      },
      NotFound: '*'
    }
  }
};

export default LinkingConfig;
