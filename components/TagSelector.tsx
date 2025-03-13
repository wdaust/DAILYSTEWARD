import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { Tag, X, Plus } from "lucide-react-native";

interface JournalTag {
  id: string;
  name: string;
}

interface TagSelectorProps {
  selectedTags: JournalTag[];
  onTagsChange: (tags: JournalTag[]) => void;
}

const TagSelector = ({ selectedTags = [], onTagsChange }: TagSelectorProps) => {
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState("");

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const createNewTag = () => {
    if (newTag.trim()) {
      const newTagObj = {
        id: Date.now().toString(),
        name: newTag.trim(),
      };
      onTagsChange([...selectedTags, newTagObj]);
      setNewTag("");
      setShowTagModal(false);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2 text-gray-700">Tags</Text>

      {/* Selected Tags */}
      <View className="flex-row flex-wrap mb-2">
        {selectedTags.map((tag) => (
          <View
            key={tag.id}
            className="flex-row items-center bg-primary-50 rounded-full px-3 py-1 mr-2 mb-2"
          >
            <Tag size={14} color="#4f46e5" />
            <Text className="mx-1 text-primary-700">{tag.name}</Text>
            <TouchableOpacity onPress={() => removeTag(tag.id)}>
              <X size={14} color="#4f46e5" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => setShowTagModal(true)}
          className="flex-row items-center bg-gray-100 rounded-full px-3 py-1 mb-2"
        >
          <Plus size={14} color="#4b5563" />
          <Text className="ml-1 text-gray-600">Add Tag</Text>
        </TouchableOpacity>
      </View>

      {/* Tag Add Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTagModal}
        onRequestClose={() => setShowTagModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Add Tag</Text>
              <TouchableOpacity onPress={() => setShowTagModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Create New Tag */}
            <View className="flex-row items-center mb-4">
              <TextInput
                className="flex-1 border border-gray-300 rounded-l-lg p-2"
                placeholder="Add new tag"
                value={newTag}
                onChangeText={setNewTag}
              />
              <TouchableOpacity
                className="bg-primary-600 px-4 py-2 rounded-r-lg"
                onPress={createNewTag}
              >
                <Text className="text-white font-medium">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TagSelector;
