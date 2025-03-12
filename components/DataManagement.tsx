import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Alert } from "react-native";
import {
  Download,
  Upload,
  Database,
  RefreshCw,
  AlertTriangle,
} from "lucide-react-native";

interface DataManagementProps {
  onExport?: () => void;
  onBackup?: () => void;
  onRestore?: () => void;
  onReset?: () => void;
  lastBackupDate?: string;
}

const DataManagement = ({
  onExport = () =>
    Alert.alert("Export", "Export functionality would be implemented here"),
  onBackup = () =>
    Alert.alert("Backup", "Backup functionality would be implemented here"),
  onRestore = () =>
    Alert.alert("Restore", "Restore functionality would be implemented here"),
  onReset = () =>
    Alert.alert("Reset", "Reset functionality would be implemented here"),
  lastBackupDate = "Never",
}: DataManagementProps) => {
  const [autoBackup, setAutoBackup] = useState(false);

  return (
    <View className="w-full p-6 bg-white rounded-2xl shadow-card">
      <Text className="text-xl font-semibold mb-5 text-neutral-800">
        Data Management
      </Text>

      {/* Export Data */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-3 border-b border-gray-200"
        onPress={onExport}
      >
        <View className="flex-row items-center">
          <Download size={20} color="#4b5563" />
          <Text className="ml-3 text-gray-700">Export Data</Text>
        </View>
        <Text className="text-gray-500 text-sm">CSV, PDF</Text>
      </TouchableOpacity>

      {/* Backup Data */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-3 border-b border-gray-200"
        onPress={onBackup}
      >
        <View className="flex-row items-center">
          <Upload size={20} color="#4b5563" />
          <Text className="ml-3 text-gray-700">Backup Data</Text>
        </View>
        <Text className="text-gray-500 text-sm">Last: {lastBackupDate}</Text>
      </TouchableOpacity>

      {/* Auto Backup */}
      <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
        <View className="flex-row items-center">
          <RefreshCw size={20} color="#4b5563" />
          <Text className="ml-3 text-gray-700">Auto Backup</Text>
        </View>
        <Switch
          value={autoBackup}
          onValueChange={setAutoBackup}
          trackColor={{ false: "#d1d5db", true: "#93c5fd" }}
          thumbColor={autoBackup ? "#3b82f6" : "#f4f4f5"}
        />
      </View>

      {/* Restore Data */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-3 border-b border-gray-200"
        onPress={onRestore}
      >
        <View className="flex-row items-center">
          <Database size={20} color="#4b5563" />
          <Text className="ml-3 text-gray-700">Restore from Backup</Text>
        </View>
        <Text className="text-gray-500 text-sm">Select file</Text>
      </TouchableOpacity>

      {/* Reset Data */}
      <TouchableOpacity
        className="flex-row items-center justify-between py-3 mt-4 bg-red-50 rounded-md px-2"
        onPress={() => {
          Alert.alert(
            "Reset All Data",
            "This will permanently delete all your data. This action cannot be undone.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Reset", onPress: onReset, style: "destructive" },
            ],
          );
        }}
      >
        <View className="flex-row items-center">
          <AlertTriangle size={20} color="#ef4444" />
          <Text className="ml-3 text-red-600 font-medium">Reset All Data</Text>
        </View>
      </TouchableOpacity>

      <Text className="text-xs text-gray-500 mt-4 text-center">
        Your data is stored locally on your device. Regular backups are
        recommended.
      </Text>
    </View>
  );
};

export default DataManagement;
