import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { SvgProps, G, Path, Rect, Polygon } from 'react-native-svg';
import { Text } from '@/components/Text';
import { shadow } from '@/styles';

const size = 120;

export function Logo(props: SvgProps) {
  return (
    <View style={styles.container}>
      <View>
        <Svg
          {...props}
          viewBox="0 0 512 512"
          style={styles.svg}
          width={size}
          height={size}
        >
          <Path
            d="M429.727,365.235c0,10.249-8.308,18.557-18.557,18.557H100.822c-10.249,0-18.557-8.308-18.557-18.557      V140.457c0-10.249,8.308-18.557,18.557-18.557H411.17c10.249,0,18.557,8.308,18.557,18.557V365.235z"
            fill="#0F2037"
          />
          <Rect
            fill="#FFFFFF"
            height="235.162"
            opacity="0.5"
            width="304.204"
            x="103.893"
            y="129.784"
          />
          <Path
            d="M253.4,372.742l-16.077-7.377c-2.165-0.992-4.565-1.52-6.942-1.52H103.893v-2.192h126.488      c2.688,0,5.407,0.597,7.85,1.716l15.146,6.946l14.034-6.781c2.539-1.227,5.373-1.881,8.2-1.881h132.485v2.192H275.611      c-2.496,0-5,0.577-7.246,1.662L253.4,372.742z"
            fill="#FFFFFF"
          />
          <Path
            d="M253.408,372.946l-14.974-12.012c-2.946-2.365-6.65-3.665-10.423-3.665H103.893v-2.192h124.119      c4.27,0,8.461,1.469,11.8,4.146l13.558,10.885l12.504-10.577c3.4-2.873,7.72-4.453,12.169-4.453h130.055v2.192H278.042      c-3.927,0-7.75,1.399-10.75,3.938L253.408,372.946z"
            fill="#FFFFFF"
          />
          <Path
            d="M253.408,370.931l-14.712-15.177c-3.119-3.22-7.477-5.065-11.958-5.065H103.893v-2.196h122.846      c5.069,0,10.004,2.093,13.535,5.73l13.096,13.516l12.097-13.153c3.558-3.87,8.615-6.093,13.873-6.093h128.758v2.196H279.339      c-4.65,0-9.116,1.962-12.262,5.381L253.408,370.931z"
            fill="#FFFFFF"
          />
          <Polygon
            fill="#E74C3C"
            points="342.185,401.923 330.119,389.4 318.054,401.923 318.054,268.946 342.185,268.946     "
          />
          <Path
            d="M408.097,345.204h-128.2c-5.289,0-10.303,2.358-13.675,6.433l-12.829,15.502l-13.834-15.854      c-3.37-3.863-8.247-6.08-13.374-6.08H103.892V110.046h125.667c6.009,0,11.609,3.04,14.884,8.077l9.008,13.861l9.008-13.861      c3.274-5.037,8.875-8.077,14.884-8.077h130.755V345.204z"
            fill="#FFFFFF"
          />
          <Rect
            fill="#0F2037"
            height="247.039"
            opacity="0.5"
            width="2.042"
            x="252.369"
            y="127.592"
          />
          <G fill="#000">
            <Rect
              height="13.73"
              opacity="0.2"
              width="111.877"
              x="280.504"
              y="134.262"
            />
            <Rect
              height="13.73"
              opacity="0.2"
              width="111.877"
              x="280.504"
              y="170.085"
            />
            <Rect
              height="13.731"
              opacity="0.2"
              width="111.877"
              x="280.504"
              y="205.907"
            />
            <Rect
              height="13.731"
              opacity="0.2"
              width="111.877"
              x="280.504"
              y="241.73"
            />
            <Rect
              height="13.73"
              opacity="0.2"
              width="111.877"
              x="280.504"
              y="277.554"
            />
            <Rect
              height="13.73"
              opacity="0.2"
              width="111.877"
              x="280.504"
              y="313.377"
            />
          </G>
          <G fill="#000">
            <Rect
              height="13.73"
              opacity="0.2"
              width="75.504"
              x="139.234"
              y="134.262"
            />
            <Rect
              height="13.73"
              opacity="0.2"
              width="111.877"
              x="121.046"
              y="170.085"
            />
            <Rect
              height="13.731"
              opacity="0.2"
              width="111.877"
              x="121.046"
              y="205.907"
            />
            <Rect
              height="13.731"
              opacity="0.2"
              width="111.877"
              x="121.046"
              y="241.73"
            />
            <Rect
              height="13.73"
              opacity="0.2"
              width="111.877"
              x="121.046"
              y="277.554"
            />
            <Rect
              height="13.73"
              opacity="0.2"
              width="111.877"
              x="121.046"
              y="313.377"
            />
          </G>
        </Svg>
      </View>
      <Text style={styles.text}>睇小說</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25
  },
  svg: {
    ...shadow(5),
    marginTop: -20
  },
  text: {
    fontWeight: 'bold',
    marginTop: -20
  }
});
