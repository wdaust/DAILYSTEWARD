import React from "react";
import { View, TextInput } from "react-native";

interface SimpleEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
}

const SimpleEditor = ({
  value,
  onChangeText,
  placeholder = "Write your thoughts here...",
  minHeight = 200,
  maxHeight = 500,
}: SimpleEditorProps) => {
  return (
    <View className="bg-white border border-gray-300 rounded-lg">
      <TextInput
        className="p-3"
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{ minHeight, maxHeight }}
        textAlignVertical="top"
      />
    </View>
  );
};

export default SimpleEditor;
