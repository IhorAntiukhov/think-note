import React, { Children, useEffect, useRef, useState } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { Surface } from "react-native-paper";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

interface ContextMenuProps {
  isOpened: boolean;
  anchor: React.ReactNode;
  onDismiss: () => void;
  children: React.ReactNode;
}

type Alignment = "top left" | "top right" | "bottom left" | "bottom right";

interface MenuPositioning {
  x: number;
  y: number;
  alignment: Alignment;
}

export default function ContextMenu({
  isOpened,
  anchor,
  onDismiss,
  children,
}: ContextMenuProps) {
  const [menuPositioning, setMenuPositioning] =
    useState<MenuPositioning | null>(null);
  const [allowCloseAnimation, setAllowCloseAnimation] = useState(false);

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const surfaceRef = useRef<View>(null);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const AnimatedSurface = Animated.createAnimatedComponent(Surface);

  useEffect(() => {
    if (isOpened && surfaceRef.current) {
      surfaceRef.current.measureInWindow((x, y, width, height) => {
        const menuHeight = Children.count(children) * 48 + 5;

        let xPosition, yPosition, alignment;

        if (windowWidth - x > 170) {
          xPosition = x;
          alignment = "left";
        } else {
          xPosition = x - 165 + width;
          alignment = "right";
        }

        if (windowHeight - y > menuHeight) {
          yPosition = y;
          alignment = `top ${alignment}`;
        } else {
          yPosition = y - (menuHeight - 5) + height;
          alignment = `bottom ${alignment}`;
        }

        setMenuPositioning({
          x: xPosition,
          y: yPosition,
          alignment: alignment as Alignment,
        });

        scale.value = withSpring(1, { duration: 250 });

        setAllowCloseAnimation(true);
      });
    } else {
      scale.value = withSpring(0, { duration: 250 });

      setTimeout(() => {
        setAllowCloseAnimation(false);
      }, 250);
    }
  }, [isOpened, scale, opacity, children, windowWidth, windowHeight]);

  return (
    <>
      <View ref={surfaceRef}>{anchor}</View>
      <Modal
        transparent
        visible={isOpened || allowCloseAnimation}
        onRequestClose={onDismiss}
      >
        <TouchableWithoutFeedback onPress={onDismiss}>
          <Animated.View
            style={{
              position: "relative",
              flex: 1,
              backgroundColor: `rgba(0, 0, 0, 0.3)`,
            }}
          >
            <AnimatedSurface
              style={{
                position: "absolute",
                left: menuPositioning?.x || 0,
                top: menuPositioning?.y || 0,
                transform: [{ scale }],
                transformOrigin: menuPositioning?.alignment || "top left",
              }}
            >
              {children}
            </AnimatedSurface>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
