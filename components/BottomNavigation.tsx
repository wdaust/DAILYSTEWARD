import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  Home,
  BookOpen,
  BookText,
  Target,
  Settings,
  Flag,
  User,
  BarChart2,
} from "lucide-react-native";

interface BottomNavigationProps {
  activeRoute?: string;
}

const BottomNavigation = ({ activeRoute = "/" }: BottomNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentRoute = activeRoute || pathname;

  // Navigation items for the bottom bar
  const navigationItems = [
    {
      name: "Home",
      icon: Home,
      route: "/",
    },
    {
      name: "Bible Reading",
      icon: BookOpen,
      route: "/bible-reading",
    },
    {
      name: "Habits",
      icon: Target,
      route: "/habits",
    },
    {
      name: "Goals",
      icon: Flag,
      route: "/goals",
    },
    {
      name: "Settings",
      icon: Settings,
      route: "/settings",
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <View className="bg-white shadow-nav flex-row justify-around items-center h-16 w-full px-4">
      {navigationItems.map((item) => {
        const isActive = currentRoute === item.route;
        const IconComponent = item.icon;

        return (
          <TouchableOpacity
            key={item.name}
            className="items-center justify-center py-2 px-3"
            onPress={() => handleNavigation(item.route)}
            accessibilityLabel={item.name}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <IconComponent
              size={24}
              color={isActive ? "#7E57C2" : "#9CA3AF"}
              strokeWidth={isActive ? 2.5 : 1.5}
            />
            {isActive && (
              <View className="absolute -bottom-1 w-8 h-1 bg-primary-600 rounded-full" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNavigation;
