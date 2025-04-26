import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, ScrollView, Animated } from "react-native";
import { Text, IconButton } from "react-native-paper";

interface ProgressTrackerProps {
  currentIndex: number;
  totalItems: number;
  score: number;
  results: Record<number, boolean>;
  colors: any;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentIndex,
  totalItems,
  score,
  results,
  colors,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const DOT_WIDTH = 40;
    const SCROLL_VIEW_WIDTH = 280;
    const scrollToX = Math.max(
      0,
      currentIndex * DOT_WIDTH - SCROLL_VIEW_WIDTH / 2 + DOT_WIDTH / 2
    );

    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: scrollToX,
          animated: true,
        });
      }
    }, 100);
  }, [currentIndex]);

  const renderProgressDots = () => {
    return Array.from({ length: totalItems }).map((_, index) => {
      const isCompleted = index < currentIndex;
      const isCurrent = index === currentIndex;

      let dotColor = colors.surfaceVariant;

      if (isCompleted) {
        if (results[index] === true) {
          dotColor = colors.success;
        } else {
          dotColor = colors.error;
        }
      } else if (isCurrent) {
        dotColor = colors.primary;
      }

      return (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
              borderWidth: isCurrent ? 2 : 0,
              borderColor: isCurrent ? colors.primaryContainer : "transparent",
            },
          ]}
        >
          {isCompleted && (
            <IconButton
              icon={results[index] ? "check" : "close"}
              size={14}
              iconColor="white"
              style={styles.iconInDot}
            />
          )}
          {isCurrent && (
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
            >
              <Text style={styles.currentDotText}>{index + 1}</Text>
            </Animated.View>
          )}
        </View>
      );
    });
  };

  return (
    <View>
      <View style={styles.statsContainer}>
        <IconButton
          icon="close"
          onPress={() => router.back()}
          style={{ marginRight: 10, marginLeft: 0 }}
        />
        <Text style={{ color: colors.onSurface }}>
          Word {currentIndex + 1} of {totalItems}
        </Text>
        <Text style={{ color: colors.primary, fontWeight: "700" }}>
          Score: {score}/{totalItems}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dotsContainer}
      >
        {renderProgressDots()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  iconInDot: {
    margin: 0,
    padding: 0,
  },
  currentDotText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ProgressTracker;
