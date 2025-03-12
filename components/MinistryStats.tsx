import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  Pressable,
} from "react-native";
import {
  Clock,
  Calendar,
  Plus,
  TrendingUp,
  X,
  Save,
  ChevronDown,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface MinistryStatsProps {
  weeklyStats?: {
    hours: number;
  };
  monthlyStats?: {
    hours: number;
  };
  onAddTime?: (data: {
    date: string;
    hours: number;
    minutes: number;
    type: string;
  }) => void;
  onViewDetailedStats?: () => void;
}

const MinistryStats = ({
  weeklyStats = {
    hours: 0,
  },
  monthlyStats = {
    hours: 0,
  },
  onAddTime = () => {},
  onViewDetailedStats = () => console.log("View detailed stats"),
}: MinistryStatsProps) => {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedType, setSelectedType] = useState("Ministry");
  const [customType, setCustomType] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [showCustomType, setShowCustomType] = useState(false);
  const [savedCustomTypes, setSavedCustomTypes] = useState<string[]>([
    "Return Visits",
    "Bible Study",
  ]);

  const stats = viewMode === "weekly" ? weeklyStats : monthlyStats;

  const handleAddTime = () => {
    const type = selectedType === "Create Custom" ? customType : selectedType;

    // Save custom type if it's new
    if (
      selectedType === "Create Custom" &&
      customType &&
      !savedCustomTypes.includes(customType)
    ) {
      setSavedCustomTypes([...savedCustomTypes, customType]);
    }

    onAddTime({
      date: selectedDate.toISOString().split("T")[0],
      hours,
      minutes,
      type,
    });
    setShowAddTimeModal(false);
    // Reset form
    setSelectedDate(new Date());
    setSelectedType("Ministry");
    setCustomType("");
    setHours(0);
    setMinutes(0);
    setShowCustomType(false);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const renderHoursButtons = () => {
    return (
      <View className="flex-row flex-wrap justify-center mb-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
          <TouchableOpacity
            key={`hour-${h}`}
            className={`w-16 h-16 m-1 rounded-lg items-center justify-center ${hours === h ? "bg-primary-600" : "bg-gray-200"}`}
            onPress={() => setHours(h)}
          >
            <Text
              className={`text-lg ${hours === h ? "text-white font-medium" : "text-gray-700"}`}
            >
              {h}h
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMinutesButtons = () => {
    return (
      <View className="flex-row flex-wrap justify-center">
        {[0, 15, 30, 45].map((m) => (
          <TouchableOpacity
            key={`min-${m}`}
            className={`w-16 h-16 m-1 rounded-lg items-center justify-center ${minutes === m ? "bg-primary-600" : "bg-gray-200"}`}
            onPress={() => setMinutes(m)}
          >
            <Text
              className={`text-lg ${minutes === m ? "text-white font-medium" : "text-gray-700"}`}
            >
              {m}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View className="bg-white p-6 rounded-2xl shadow-card w-full">
      <View className="flex-row items-center justify-between mb-5">
        <View className="flex-row items-center">
          <Calendar size={20} color="#7E57C2" className="mr-2" />
          <Text className="text-xl font-semibold text-neutral-800">
            Ministry Time
          </Text>
        </View>
        <TouchableOpacity
          className="bg-primary-600 p-2 rounded-full"
          onPress={() => setShowAddTimeModal(true)}
        >
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className="items-center bg-primary-50 p-4 rounded-xl mb-5">
        <View className="flex-row items-center mb-1">
          <Clock size={16} color="#7E57C2" />
          <Text className="ml-2 text-neutral-600 text-xs">Total Hours</Text>
        </View>
        <Text className="text-2xl font-bold text-neutral-800">
          {stats.hours}
        </Text>
      </View>

      {/* Progress indicators */}
      <View className="mb-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xs text-neutral-500">Hours Goal</Text>
          <Text className="text-xs text-primary-600 font-medium">
            {stats.hours}/{viewMode === "weekly" ? 8 : 30} hours
          </Text>
        </View>
        <View className="h-3 bg-secondary-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-600 rounded-full"
            style={{
              width: `${Math.min(
                100,
                (stats.hours / (viewMode === "weekly" ? 8 : 30)) * 100,
              )}%`,
            }}
          />
        </View>
      </View>

      {/* Trend indicator */}
      <View className="flex-row items-center justify-between bg-secondary-100 p-4 rounded-xl mb-4">
        <View className="flex-row items-center">
          <TrendingUp size={18} color="#7E57C2" />
          <Text className="ml-2 text-neutral-700">
            {viewMode === "weekly"
              ? "This week vs last week"
              : "This month vs last month"}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-primary-600 font-medium">+12%</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="bg-primary-600 py-4 rounded-xl items-center mt-2 flex-1 mr-2"
          onPress={() => setShowAddTimeModal(true)}
        >
          <Text className="text-white font-medium">Add Time</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-primary-100 py-4 rounded-xl items-center mt-2 flex-1 ml-2"
          onPress={onViewDetailedStats}
        >
          <Text className="text-primary-700 font-medium">View History</Text>
        </TouchableOpacity>
      </View>

      {/* Add Time Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddTimeModal}
        onRequestClose={() => setShowAddTimeModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl p-4 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-primary-800">
                Add Ministry Time
              </Text>
              <TouchableOpacity onPress={() => setShowAddTimeModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Date Selector */}
              <View className="mb-4">
                <Text className="text-base font-medium mb-2 text-gray-700">
                  Date
                </Text>
                <Pressable
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-gray-800">
                    {selectedDate.toLocaleDateString()}
                  </Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              {/* Type Selector */}
              <View className="mb-4">
                <Text className="text-base font-medium mb-2 text-gray-700">
                  Type
                </Text>
                <TouchableOpacity
                  className="flex-row justify-between items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
                  onPress={() => setShowCustomType(!showCustomType)}
                >
                  <Text className="text-gray-800">{selectedType}</Text>
                  <ChevronDown size={18} color="#6B7280" />
                </TouchableOpacity>

                {showCustomType && (
                  <View className="mt-2 border border-gray-300 rounded-lg overflow-hidden">
                    <TouchableOpacity
                      className={`p-3 ${selectedType === "Ministry" ? "bg-primary-100" : "bg-white"} border-b border-gray-200`}
                      onPress={() => {
                        setSelectedType("Ministry");
                        setShowCustomType(false);
                      }}
                    >
                      <Text
                        className={`${selectedType === "Ministry" ? "text-primary-700 font-medium" : "text-gray-800"}`}
                      >
                        Ministry
                      </Text>
                    </TouchableOpacity>

                    {/* Saved custom types */}
                    {savedCustomTypes.map((type, index) => (
                      <TouchableOpacity
                        key={`type-${index}`}
                        className={`p-3 ${selectedType === type ? "bg-primary-100" : "bg-white"} border-b border-gray-200`}
                        onPress={() => {
                          setSelectedType(type);
                          setShowCustomType(false);
                        }}
                      >
                        <Text
                          className={`${selectedType === type ? "text-primary-700 font-medium" : "text-gray-800"}`}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                      className={`p-3 ${selectedType === "Create Custom" ? "bg-primary-100" : "bg-white"}`}
                      onPress={() => {
                        setSelectedType("Create Custom");
                        setShowCustomType(false);
                      }}
                    >
                      <Text
                        className={`${selectedType === "Create Custom" ? "text-primary-700 font-medium" : "text-gray-800"}`}
                      >
                        Create Custom
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Custom Type Input */}
              {selectedType === "Create Custom" && (
                <View className="mb-4">
                  <Text className="text-base font-medium mb-2 text-gray-700">
                    Custom Type
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800"
                    value={customType}
                    onChangeText={setCustomType}
                    placeholder="Enter custom type"
                  />
                </View>
              )}

              {/* Hours Selector */}
              <View className="mb-4">
                <Text className="text-base font-medium mb-2 text-gray-700">
                  Hours
                </Text>
                {renderHoursButtons()}
              </View>

              {/* Minutes Selector */}
              <View className="mb-6">
                <Text className="text-base font-medium mb-2 text-gray-700">
                  Minutes
                </Text>
                {renderMinutesButtons()}
              </View>

              {/* Total Time Display */}
              <View className="mb-6 bg-primary-50 p-4 rounded-lg items-center">
                <Text className="text-primary-700 font-medium mb-1">
                  Total Time
                </Text>
                <Text className="text-2xl font-bold text-primary-800">
                  {hours}h {minutes}m
                </Text>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className="bg-primary-600 py-4 rounded-xl items-center mb-4 flex-row justify-center"
                onPress={handleAddTime}
              >
                <Save size={18} color="#FFFFFF" />
                <Text className="text-white font-medium ml-2">Save Time</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MinistryStats;
