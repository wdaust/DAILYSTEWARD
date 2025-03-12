import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Search, Tag, X, Plus, Check } from "lucide-react-native";

interface ScriptureTag {
  id: string;
  reference: string;
}

interface ScriptureTagSelectorProps {
  selectedTags: ScriptureTag[];
  onTagsChange: (tags: ScriptureTag[]) => void;
  suggestedTags?: ScriptureTag[];
}

const ScriptureTagSelector = ({
  selectedTags = [],
  onTagsChange,
  suggestedTags = [],
}: ScriptureTagSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTagModal, setShowTagModal] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [filteredTags, setFilteredTags] = useState<ScriptureTag[]>([]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = suggestedTags.filter((tag) =>
        tag.reference.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(suggestedTags);
    }
  }, [searchQuery, suggestedTags]);

  const addTag = (tag: ScriptureTag) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setSearchQuery("");
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const createNewTag = () => {
    if (newTag.trim()) {
      const newTagObj = {
        id: Date.now().toString(),
        reference: newTag.trim(),
      };
      onTagsChange([...selectedTags, newTagObj]);
      setNewTag("");
      setShowTagModal(false);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2 text-gray-700">
        Scripture References
      </Text>

      {/* Selected Tags */}
      <View className="flex-row flex-wrap mb-2">
        {selectedTags.map((tag) => (
          <View
            key={tag.id}
            className="flex-row items-center bg-indigo-50 rounded-full px-3 py-1 mr-2 mb-2"
          >
            <Tag size={14} color="#4f46e5" />
            <Text className="mx-1 text-indigo-700">{tag.reference}</Text>
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

      {/* Tag Search Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTagModal}
        onRequestClose={() => setShowTagModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl p-4 h-2/3">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Add Scripture Reference</Text>
              <TouchableOpacity onPress={() => setShowTagModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
              <Search size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-2"
                placeholder="Search scripture references..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Create New Tag */}
            <View className="flex-row items-center mb-4">
              <TextInput
                className="flex-1 border border-gray-300 rounded-l-lg p-2"
                placeholder="Add new reference (e.g., John 3:16)"
                value={newTag}
                onChangeText={setNewTag}
              />
              <TouchableOpacity
                className="bg-indigo-600 px-4 py-2 rounded-r-lg"
                onPress={createNewTag}
              >
                <Text className="text-white font-medium">Add</Text>
              </TouchableOpacity>
            </View>

            {/* Suggested Tags */}
            <Text className="font-medium mb-2 text-gray-700">
              Suggested References
            </Text>
            <FlatList
              data={filteredTags}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row justify-between items-center p-3 border-b border-gray-100"
                  onPress={() => {
                    addTag(item);
                    setShowTagModal(false);
                  }}
                >
                  <View className="flex-row items-center">
                    <Tag size={16} color="#4f46e5" />
                    <Text className="ml-2 text-gray-800">{item.reference}</Text>
                  </View>
                  {selectedTags.some((tag) => tag.id === item.id) && (
                    <Check size={16} color="#10b981" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-500 py-4">
                  No matching references found
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ScriptureTagSelector;
