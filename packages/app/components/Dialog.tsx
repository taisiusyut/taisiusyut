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
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import { Subject } from 'rxjs';
import { shadow } from '@/utils/shadow';

export interface DialogProps {
  children?: ReactNode;
  onClose?: () => void;
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
  const { onClose } = useMemo(
    () => ({
      onClose: () => setProps(props => props.slice(0, -1))
    }),
    []
  );

  useEffect(() => {
    setProps([]);
    const subscription = subject.subscribe(newProps => {
      setProps(props => [...props, newProps]);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {props.map(({ component: Component, props }, idx) => (
        <Component key={idx} {...props} onClose={onClose} />
      ))}
    </>
  );
}

const duration = 300;

export function Dialog({ onClose, children }: DialogProps) {
  const anim = useRef(new Animated.Value(0));

  const { current: handleClose } = useRef(() =>
    Animated.timing(anim.current, {
      toValue: 0,
      duration,
      useNativeDriver: true
    }).start(() => onClose && onClose())
  );

  useLayoutEffect(() => {
    Animated.timing(anim.current, {
      toValue: 1,
      duration,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={{ ...styles.backdrop, opacity: anim.current }}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            ...styles.dialog,
            opacity: anim.current,
            transform: [
              {
                translateY: anim.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0]
                })
              }
            ]
          }}
        >
          <View>{children}</View>
        </Animated.View>
      </View>
    </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space
  },
  dialog: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 3,
    marginBottom: 90,
    paddingTop: space * 0.75,
    paddingBottom: space,
    ...shadow(7)
  }
});
