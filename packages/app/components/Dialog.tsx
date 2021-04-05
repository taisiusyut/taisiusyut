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
import { Feather } from '@expo/vector-icons';
import { shadow } from '@/utils/shadow';
import { colors } from '@/utils/color';

export interface DialogProps {
  children?: ReactNode;
  onClose?: () => void;
  onClosed?: () => void;
  visible?: boolean;
  title?: string;
  icon?: React.ComponentProps<typeof Feather>['name'];
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
      onClosed: () => setProps(props => props.slice(0, -1))
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

const duration = 300;

export function Dialog({
  icon,
  title,
  visible,
  onClose,
  onClosed,
  children
}: DialogProps) {
  const anim = useRef(new Animated.Value(0));

  useLayoutEffect(() => {
    Animated.timing(anim.current, {
      toValue: visible ? 1 : 0,
      duration,
      useNativeDriver: true
    }).start(() => {
      !visible && onClosed && onClosed();
    });
  }, [visible, onClosed]);

  return (
    <Modal animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[styles.backdrop, { opacity: anim.current }]}
          ></Animated.View>
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.dialog,
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
            {icon && <Feather name={icon} size={22} />}
            <Text style={styles.titleText}>{title || ''}</Text>
            <Feather name="x" size={22} onPress={onClose} />
          </View>
          <View>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export const space = 20;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: space,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.primary,
    borderBottomColor: colors.light.textMuted,
    borderBottomWidth: 1
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 5
  },
  dialog: {
    alignSelf: 'stretch',
    borderRadius: 6,
    backgroundColor: colors.light.secondary,
    paddingBottom: space,
    margin: space,
    overflow: 'hidden',
    ...shadow(7)
  }
});
