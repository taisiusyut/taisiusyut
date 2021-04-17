import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  ReactNode
} from 'react';
import {
  Animated,
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { Subject } from 'rxjs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Feather } from '@expo/vector-icons';
import { ColorSchemeName, useColorScheme } from '@/hooks/useColorScheme';
import { shadow } from '@/utils/shadow';
import { colors, darken, lighten } from '@/utils/color';

export interface DialogProps {
  children?: ReactNode;
  onClose?: () => void;
  onClosed?: () => void;
  visible?: boolean;
  title?: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
  maxWidth?: number;
}

interface State<P extends DialogProps = any> {
  component: React.ComponentType<P>;
  props: P;
}

const subject = new Subject<State>();

export function createDialogHandler<P extends DialogProps>(
  component: State<P>['component'],
  defaultProps?: Partial<P>
) {
  return function openDialog(props: P) {
    return subject.next({ component, props: { ...defaultProps, ...props } });
  };
}

export const openDialog = createDialogHandler(Dialog);

export function DialogContainer() {
  const [props, setProps] = useState<State[]>([]);
  const { onClose, onClosed } = useMemo(
    () => ({
      onClose: () =>
        setProps(props => {
          const last = props.slice(-1)[0];
          return [
            ...props.slice(0, props.length - 1),
            { ...last, props: { ...last.props, visible: false } }
          ];
        }),
      onClosed: () =>
        setProps(props => {
          return props.filter(({ props }) => props.visible);
        })
    }),
    []
  );

  useEffect(() => {
    setProps([]);
    const subscription = subject.subscribe(newProps => {
      setProps(props => [
        ...props,
        { ...newProps, props: { ...newProps.props, visible: true } }
      ]);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {props.map(({ component: Component, props }, idx) => (
        <Component key={idx} {...props} onClose={onClose} onClosed={onClosed} />
      ))}
    </>
  );
}

const duration = 250;
const borderRadius = 6;
export const space = 20;

const getStyles = (theme: NonNullable<ColorSchemeName>) => {
  const color = colors[theme];
  return StyleSheet.create({
    backdrop: {
      backgroundColor:
        theme === 'dark' ? `rgba(16,22,26,.5)` : `rgba(0,0,0,0.5)`,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    centeredView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    scrollView: { alignSelf: 'stretch' },
    scrollViewContent: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    header: {
      paddingVertical: 10,
      paddingHorizontal: space,
      height: 55,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: color.primary,
      borderBottomWidth: 1,
      borderBottomColor: color.border,
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius
    },
    titleText: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      marginLeft: 5,
      color: color.text
    },
    dialog: {
      alignSelf: 'stretch',
      borderRadius: borderRadius,
      backgroundColor:
        theme === 'dark'
          ? lighten(color.primary, 15)
          : darken(color.primary, 10),
      paddingBottom: space,
      margin: space,
      ...shadow(1, {})
    }
  });
};

export function Dialog({
  icon,
  title,
  visible,
  maxWidth,
  onClose,
  onClosed,
  children
}: DialogProps) {
  const theme = useColorScheme();
  const anim = useRef(new Animated.Value(0));
  const styles = getStyles(theme);

  useLayoutEffect(() => {
    Animated.timing(anim.current, {
      duration,
      toValue: visible ? 1 : 0,
      useNativeDriver: true
    }).start(() => {
      !visible && onClosed && onClosed();
    });
  }, [visible, onClosed]);

  return (
    <Modal animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <KeyboardAwareScrollView
          bounces={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View
              style={[styles.backdrop, { opacity: anim.current }]}
            ></Animated.View>
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.dialog,
              maxWidth ? { maxWidth, width: '100%', alignSelf: 'auto' } : {},
              {
                opacity: anim.current,
                transform: [
                  {
                    translateY: anim.current.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.header}>
              {icon && (
                <Feather name={icon} size={22} color={styles.titleText.color} />
              )}
              <Text style={styles.titleText}>{title || ''}</Text>
              <Feather
                name="x"
                size={22}
                color={styles.titleText.color}
                onPress={onClose}
              />
            </View>
            <View>{children}</View>
          </Animated.View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}
