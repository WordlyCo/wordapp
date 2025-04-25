import React, { useEffect, Ref } from "react";
import { Animated, View, Text, StyleSheet, ScrollView } from "react-native";
import { IconButton } from "react-native-paper";

type DotStyle = {
  backgroundColor: string;
  transform?: { scale: number }[];
  borderWidth?: number;
  borderColor?: string;
};

interface ProgressDotsProps {
  totalDots: number;
  currentIndex: number;
  answerResults: Record<number, boolean>;
  dotsScrollViewRef: Ref<ScrollView>;
  pulseAnim: Animated.Value;
  colors: any;
}

const ProgressDots: React.FC<ProgressDotsProps> = ({
  totalDots,
  currentIndex,
  answerResults,
  dotsScrollViewRef,
  pulseAnim,
  colors,
}) => {
  // Center the current dot in the view
  useEffect(() => {
    const DOT_WIDTH = 42; // dot width + margin
    const SCROLL_VIEW_WIDTH = 300; // approximate visible width
    const scrollToX = Math.max(
      0,
      currentIndex * DOT_WIDTH - SCROLL_VIEW_WIDTH / 2 + DOT_WIDTH / 2
    );

    setTimeout(() => {
      if (
        dotsScrollViewRef &&
        "current" in dotsScrollViewRef &&
        dotsScrollViewRef.current
      ) {
        dotsScrollViewRef.current.scrollTo({
          x: scrollToX,
          animated: true,
        });
      }
    }, 100);
  }, [currentIndex, dotsScrollViewRef]);

  return (
    <ScrollView
      ref={dotsScrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.dotsContainer}
    >
      {Array.from({ length: totalDots }).map((_, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        // Get answer status
        let dotColor = colors.surfaceVariant; // default for unanswered
        let dotIcon = "";

        if (isCompleted) {
          // Check if we have a record for this index
          if (answerResults[index] === true) {
            dotColor = "#4CAF50"; // green for correct
            dotIcon = "check";
          } else if (answerResults[index] === false) {
            dotColor = "#F44336"; // red for incorrect
            dotIcon = "close";
          } else {
            dotColor = colors.secondary; // fallback for completed but unknown result
          }
        } else if (isCurrent) {
          dotColor = colors.primary;
        }

        // Build the style based on status
        const dotStyle: DotStyle = {
          backgroundColor: dotColor,
          ...(isCompleted ? { transform: [{ scale: 0.8 }] } : {}),
          ...(isCurrent
            ? {
                borderWidth: 2,
                borderColor: colors.primaryContainer,
              }
            : {}),
        };

        return (
          <View key={index} style={[styles.dot, dotStyle]}>
            {isCompleted && dotIcon && (
              <Animated.View>
                <IconButton
                  icon={dotIcon}
                  size={12}
                  iconColor="#fff"
                  style={styles.checkIcon}
                />
              </Animated.View>
            )}
            {isCurrent && (
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.currentDotText}>{index + 1}</Text>
              </Animated.View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  checkIcon: {
    margin: 0,
    padding: 0,
  },
  currentDotText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ProgressDots;
