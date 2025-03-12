import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Book,
  Calendar,
  Clock,
  FileText,
  Target,
  Flag,
} from "lucide-react-native";

interface QuickAccessGridProps {
  onNavigate?: (route: string) => void;
  items?: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    route: string;
    color: string;
  }>;
}

const QuickAccessGrid = ({
  onNavigate,
  items = [
    {
      id: "journal",
      title: "Journal",
      description: "Record spiritual reflections",
      icon: <FileText size={24} color="#ffffff" />,
      route: "/journal",
      color: "bg-indigo-600",
    },
    {
      id: "habits",
      title: "Habits",
      description: "Track spiritual routines",
      icon: <Target size={24} color="#ffffff" />,
      route: "/habits",
      color: "bg-green-600",
    },
    {
      id: "goals",
      title: "Goals",
      description: "Set and track spiritual goals",
      icon: <Flag size={24} color="#ffffff" />,
      route: "/goals",
      color: "bg-purple-600",
    },
    {
      id: "bible-reading",
      title: "Bible Reading",
      description: "Follow your reading plan",
      icon: <Book size={24} color="#ffffff" />,
      route: "/bible-reading",
      color: "bg-blue-600",
    },
    {
      id: "meetings",
      title: "Meeting Prep",
      description: "Prepare for congregation meetings",
      icon: <Calendar size={24} color="#ffffff" />,
      route: "/meetings",
      color: "bg-orange-600",
    },
  ],
}: QuickAccessGridProps) => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route);
    }
  };

  return (
    <View className="w-full bg-white p-4 rounded-xl shadow-sm">
      <Text className="text-xl font-bold mb-4 text-gray-800">Quick Access</Text>

      <View className="flex-row flex-wrap justify-between">
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="w-[48%] mb-4 rounded-lg overflow-hidden"
            onPress={() => handleNavigation(item.route)}
          >
            <View
              className="flex-row items-center p-4 rounded-lg"
              style={{
                backgroundColor: item.color.includes("bg-")
                  ? undefined
                  : item.color,
              }}
            >
              <View className={`p-2 rounded-full mr-3 ${item.color}`}>
                {item.icon}
              </View>
              <View className="flex-1">
                <Text className="font-bold text-white">{item.title}</Text>
                <Text
                  className="text-xs text-white opacity-80"
                  numberOfLines={1}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        className="mt-2 p-3 border border-gray-200 rounded-lg flex-row items-center justify-center"
        onPress={() => handleNavigation("/settings")}
      >
        <Clock size={18} color="#6B7280" />
        <Text className="ml-2 text-gray-600 font-medium">
          View All Features
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuickAccessGrid;
