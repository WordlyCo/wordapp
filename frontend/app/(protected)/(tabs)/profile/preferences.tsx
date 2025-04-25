import { formatTimezone, timezones } from "@/lib/utils";
import { CustomSnackbar } from "@/src/components/CustomSnackbar";
import { useAppTheme } from "@/src/contexts/ThemeContext";
import { useStore } from "@/src/stores/store";
import { UserPreferences } from "@/src/types/user";
import { useUser } from "@clerk/clerk-expo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, List, Switch, Text, TextInput } from "react-native-paper";

const PreferencesScreen = () => {
  const { user } = useUser();
  const preferences = useStore((state) => state.user?.preferences);
  const updatePreferences = useStore((state) => state.updatePreferences);
  const { colors } = useAppTheme();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [notifications, setNotifications] = useState(
    preferences?.notificationsEnabled ?? false
  );
  const [dailyWordGoal, setDailyWordGoal] = useState(
    preferences?.dailyWordGoal ?? 10
  );
  const [dailyPracticeTimeGoal, setDailyPracticeTimeGoal] = useState(
    preferences?.dailyPracticeTimeGoal ?? 5
  );
  const [theme, setTheme] = useState(preferences?.theme ?? "light");
  const [timeZone, setTimeZone] = useState(
    preferences?.timeZone ?? "America/Los_Angeles"
  );
  const [open, setOpen] = useState(false);

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const sortedTimezones = useMemo(() => {
    const tzList = [...timezones];
    const localIndex = tzList.indexOf(localTimezone);
    if (localIndex !== -1) {
      tzList.splice(localIndex, 1);
      tzList.unshift(localTimezone);
    }
    return tzList;
  }, [localTimezone]);

  const [timezoneItems, setTimezoneItems] = useState(
    sortedTimezones.map((tz: string) => ({
      label: formatTimezone(tz),
      value: tz,
    }))
  );

  const handleUpdatePreferences = (
    newPreferences: Partial<UserPreferences>
  ) => {
    if (!user) return;

    const oldPreferences = Object.assign({}, user.unsafeMetadata.preferences);

    user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        preferences: {
          ...oldPreferences,
          ...newPreferences,
        },
      },
    });

    updatePreferences({
      ...preferences,
      ...newPreferences,
    });

    setSnackbarVisible(true);
  };

  const debouncedSave = useMemo(
    () => debounce(handleUpdatePreferences, 500),
    [handleUpdatePreferences]
  );

  useEffect(() => {
    if (
      notifications === preferences?.notificationsEnabled &&
      dailyWordGoal === preferences?.dailyWordGoal &&
      dailyPracticeTimeGoal === preferences?.dailyPracticeTimeGoal &&
      timeZone === preferences?.timeZone &&
      theme === preferences?.theme
    ) {
      return;
    }

    debouncedSave({
      notificationsEnabled: notifications,
      dailyWordGoal,
      dailyPracticeTimeGoal,
      timeZone,
      theme,
    });
  }, [notifications, dailyWordGoal, dailyPracticeTimeGoal, timeZone, theme]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.pickerContainer}>
        <DropDownPicker
          open={open}
          value={timeZone}
          items={timezoneItems}
          setOpen={setOpen}
          setValue={setTimeZone}
          setItems={setTimezoneItems}
          placeholder="Select timezone..."
          searchable={true}
          searchPlaceholder="Search..."
          listMode="SCROLLVIEW"
          style={{
            backgroundColor: colors.background,
            borderColor: open ? colors.primary : colors.outline,
            height: 56,
          }}
          textStyle={{ color: colors.onSurface, fontSize: 16 }}
          placeholderStyle={{ color: colors.onSurface }}
          dropDownContainerStyle={{
            backgroundColor: colors.surface,
            borderColor: colors.primary,
            maxHeight: 250,
          }}
          labelStyle={{ fontSize: 16 }}
          listItemContainerStyle={{ paddingVertical: 8 }}
          searchContainerStyle={{
            borderBottomColor: colors.primary,
          }}
          searchTextInputStyle={{
            color: colors.onSurface,
            borderWidth: 0,
          }}
          ArrowDownIconComponent={() => (
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color={colors.primary}
            />
          )}
          ArrowUpIconComponent={() => (
            <MaterialCommunityIcons
              name="chevron-up"
              size={24}
              color={colors.primary}
            />
          )}
          onSelectItem={(item) => {
            if (item?.value) {
              setTimeZone(item.value);
              setOpen(false);
            }
          }}
          zIndex={3000}
          zIndexInverse={1000}
        />
      </View>
      <ScrollView
        style={[
          styles.scrollViewContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <List.Section>
          <List.Item
            title="Push Notifications"
            description="Receive updates and reminders"
            left={(props) => <List.Icon icon="bell-outline" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={() => {
                  setNotifications(!notifications);
                }}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Theme"
            description={theme === "dark" ? "Dark" : "Light"}
            left={(props) => (
              <MaterialCommunityIcons
                name={
                  theme === "dark"
                    ? "moon-waning-crescent"
                    : "white-balance-sunny"
                }
                size={24}
                style={{ alignSelf: "center" }}
                color={colors.onSurface}
              />
            )}
            right={() => (
              <Switch
                value={theme === "dark"}
                onValueChange={() => {
                  setTheme(theme === "light" ? "dark" : "light");
                }}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Daily Word Goal"
            description="Set your daily word goal"
            left={(props) => <List.Icon icon="target" />}
            right={() => (
              <TextInput
                value={dailyWordGoal.toString()}
                onChangeText={(text) => setDailyWordGoal(Number(text))}
                keyboardType="number-pad"
              />
            )}
          />
          <Divider />

          <List.Item
            title="Daily Practice Time Goal"
            description="Set your daily practice time goal"
            left={(props) => <List.Icon icon="clock-outline" />}
            right={() => (
              <TextInput
                value={dailyPracticeTimeGoal.toString()}
                onChangeText={(text) => setDailyPracticeTimeGoal(Number(text))}
                keyboardType="number-pad"
              />
            )}
          />

          <Divider />
          <Text>
            Last updated at {preferences?.updatedAt?.toLocaleString()}
          </Text>
        </List.Section>
      </ScrollView>

      <CustomSnackbar
        visible={snackbarVisible}
        message="Preferences updated"
        type="success"
        onDismiss={() => setSnackbarVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  pickerContainer: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginTop: 10,
    zIndex: 3000,
  },
});

export default PreferencesScreen;
