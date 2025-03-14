import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification behavior
export const configureNotifications = async () => {
  // Set notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // Request permissions
  if (Platform.OS !== "web") {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for notification!");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error configuring notifications:", error);
      return false;
    }
  }

  return false;
};

// Schedule a notification
export const scheduleNotification = async ({
  title,
  body,
  data = {},
  trigger,
}: {
  title: string;
  body: string;
  data?: any;
  trigger: Notifications.NotificationTriggerInput;
}) => {
  try {
    // Request permissions if needed
    const permissionsGranted = await configureNotifications();
    if (!permissionsGranted && Platform.OS !== "web") {
      console.log("Notification permissions not granted");
      return null;
    }

    // Add a delay before scheduling to prevent stream closure issues
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Use a simple approach without nested promises to avoid stream closure issues
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger,
      });
      // Add a delay after scheduling before returning
      await new Promise((r) => setTimeout(r, 500));
      return identifier;
    } catch (err) {
      console.error("Error in scheduleNotificationAsync:", err);
      return null;
    }
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return null;
  }
};

// Schedule a habit reminder
export const scheduleHabitReminder = async (habit: {
  id: string;
  name: string;
  frequency: string;
  reminders: { enabled: boolean; time: string };
}) => {
  if (!habit || !habit.reminders?.enabled || !habit.reminders?.time) {
    console.log("Skipping reminder setup - missing data", habit);
    return null;
  }

  try {
    if (!habit.id) {
      console.log("Cannot schedule reminder - missing habit ID");
      return null;
    }

    // Add a longer delay before canceling existing notifications
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Cancel any existing notifications for this habit
    await cancelHabitReminder(habit.id);

    // Add another delay after canceling
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Parse the time string (format: "HH:MM")
    const [hours, minutes] = habit.reminders.time.split(":").map(Number);

    // Create the trigger based on frequency
    let trigger: Notifications.NotificationTriggerInput;

    switch (habit.frequency) {
      case "daily":
        // Daily at the specified time
        trigger = {
          hour: hours,
          minute: minutes,
          repeats: true,
        };
        break;

      case "weekly":
        // Weekly on the current day at the specified time
        const now = new Date();
        trigger = {
          weekday: now.getDay() + 1, // 1-7 for Monday-Sunday
          hour: hours,
          minute: minutes,
          repeats: true,
        };
        break;

      case "monthly":
        // Monthly on the current date at the specified time
        trigger = {
          day: new Date().getDate(),
          hour: hours,
          minute: minutes,
          repeats: true,
        };
        break;

      default:
        // Default to daily
        trigger = {
          hour: hours,
          minute: minutes,
          repeats: true,
        };
    }

    // Add a delay before scheduling
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Schedule notification directly without nested promises
    try {
      const notificationId = await scheduleNotification({
        title: `Reminder: ${habit.name}`,
        body: `It's time for your ${habit.frequency} habit: ${habit.name}`,
        data: { habitId: habit.id },
        trigger,
      });

      // Add a delay before storing the notification ID
      await new Promise((r) => setTimeout(r, 500));

      // Store the notification ID for later reference
      if (notificationId) {
        await storeNotificationId(habit.id, notificationId);
      }

      return notificationId;
    } catch (error) {
      console.error("Error in scheduled notification:", error);
      return null;
    }
  } catch (error) {
    console.error("Error scheduling habit reminder:", error);
    return null;
  }
};

// Cancel a habit reminder
export const cancelHabitReminder = async (habitId: string) => {
  try {
    if (!habitId) {
      console.log("Cannot cancel reminder - missing habit ID");
      return false;
    }

    // Add a longer delay before getting notification ID
    await new Promise((resolve) => setTimeout(resolve, 800));

    const notificationId = await getNotificationId(habitId);
    if (notificationId) {
      // Add another delay before cancellation
      await new Promise((resolve) => setTimeout(resolve, 800));

      try {
        // Cancel the notification directly without nested promises
        await Notifications.cancelScheduledNotificationAsync(notificationId);

        // Add a delay before removing notification ID
        await new Promise((r) => setTimeout(r, 800));

        await removeNotificationId(habitId);
      } catch (err) {
        console.error("Error in notification cancellation:", err);
        // Continue execution even if there's an error
      }
    }
    return true;
  } catch (error) {
    console.error("Error canceling habit reminder:", error);
    return false;
  }
};

// Store notification ID in AsyncStorage
const storeNotificationId = async (habitId: string, notificationId: string) => {
  try {
    const key = `notification_${habitId}`;
    await AsyncStorage.setItem(key, notificationId);
  } catch (error) {
    console.error("Error storing notification ID:", error);
  }
};

// Get notification ID from AsyncStorage
const getNotificationId = async (habitId: string) => {
  try {
    const key = `notification_${habitId}`;
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error("Error getting notification ID:", error);
    return null;
  }
};

// Remove notification ID from AsyncStorage
const removeNotificationId = async (habitId: string) => {
  try {
    const key = `notification_${habitId}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing notification ID:", error);
  }
};

// Update habit reminders when settings change
export const updateHabitReminders = async (habits: any[]) => {
  try {
    // Add initial delay before processing any habits
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Process habits one at a time with significant delays between each
    for (const habit of habits) {
      try {
        // Add a larger delay between each habit processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (habit.reminders?.enabled) {
          // Process each enabled habit with its own try/catch
          try {
            // Cancel first with a delay
            await cancelHabitReminder(habit.id);

            // Add significant delay between cancel and schedule
            await new Promise((r) => setTimeout(r, 2000));

            // Schedule the reminder
            await scheduleHabitReminder(habit);
          } catch (notificationError) {
            console.error(
              `Notification error for habit ${habit.id}:`,
              notificationError,
            );
          }
        } else {
          // Just cancel if not enabled
          try {
            await cancelHabitReminder(habit.id);
          } catch (cancelError) {
            console.error(`Cancel error for habit ${habit.id}:`, cancelError);
          }
        }

        // Add significant delay after processing each habit
        await new Promise((r) => setTimeout(r, 1500));
      } catch (habitError) {
        console.error(`Error processing habit ${habit.id}:`, habitError);
        // Add delay after error before continuing
        await new Promise((r) => setTimeout(r, 1000));
        // Continue with next habit even if one fails
      }
    }
  } catch (error) {
    console.error("Error updating habit reminders:", error);
  }
};
