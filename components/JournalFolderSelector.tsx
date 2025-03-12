import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import {
  Folder,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  FolderPlus,
} from "lucide-react-native";

export interface JournalFolder {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface JournalFolderSelectorProps {
  folders: JournalFolder[];
  selectedFolder: JournalFolder | null;
  onFolderSelect: (folder: JournalFolder) => void;
  onFolderCreate: (folder: JournalFolder) => void;
  onFolderUpdate: (folder: JournalFolder) => void;
  onFolderDelete: (folderId: string) => void;
}

const JournalFolderSelector = ({
  folders = [
    { id: "1", name: "Spiritual Gems", color: "#4f46e5" },
    { id: "2", name: "Meeting Notes", color: "#10b981" },
    { id: "3", name: "Ministry Experiences", color: "#f59e0b" },
    { id: "4", name: "Personal Reflections", color: "#8b5cf6" },
  ],

  selectedFolder,
  onFolderSelect,
  onFolderCreate,
  onFolderUpdate,
  onFolderDelete,
}: JournalFolderSelectorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4f46e5");
  const [editingFolder, setEditingFolder] = useState<JournalFolder | null>(
    null,
  );

  const colors = [
    "#4f46e5", // indigo
    "#10b981", // green
    "#ef4444", // red
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#f97316", // orange
  ];

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        color: selectedColor,
      };
      onFolderCreate(newFolder);
      setNewFolderName("");
      setSelectedColor("#4f46e5");
      setShowEditModal(false);
    }
  };

  const handleUpdateFolder = () => {
    if (editingFolder && newFolderName.trim()) {
      const updatedFolder = {
        ...editingFolder,
        name: newFolderName.trim(),
        color: selectedColor,
      };
      onFolderUpdate(updatedFolder);
      setEditingFolder(null);
      setNewFolderName("");
      setSelectedColor("#4f46e5");
      setShowEditModal(false);
    }
  };

  const startEditFolder = (folder: JournalFolder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setSelectedColor(folder.color);
    setShowEditModal(true);
  };

  const confirmDeleteFolder = (folderId: string) => {
    // In a real app, you would show a confirmation dialog
    onFolderDelete(folderId);
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-1 text-gray-700">Folder</Text>
      <TouchableOpacity
        className="flex-row items-center justify-between border border-gray-300 rounded-lg p-3 bg-white"
        onPress={() => setShowModal(true)}
      >
        <View className="flex-row items-center">
          {selectedFolder ? (
            <>
              <View
                style={{ backgroundColor: selectedFolder.color }}
                className="w-6 h-6 rounded-md items-center justify-center mr-2"
              >
                <Folder size={14} color="#ffffff" />
              </View>
              <Text className="text-gray-800">{selectedFolder.name}</Text>
            </>
          ) : (
            <Text className="text-gray-500">Select a folder</Text>
          )}
        </View>
        <ChevronDown size={20} color="#6b7280" />
      </TouchableOpacity>

      {/* Folder Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Select Folder</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row justify-between items-center p-3 border-b border-gray-100"
                  onPress={() => {
                    onFolderSelect(item);
                    setShowModal(false);
                  }}
                >
                  <View className="flex-row items-center">
                    <View
                      style={{ backgroundColor: item.color }}
                      className="w-8 h-8 rounded-md items-center justify-center mr-3"
                    >
                      <Folder size={16} color="#ffffff" />
                    </View>
                    <Text className="text-gray-800">{item.name}</Text>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      className="p-2"
                      onPress={() => startEditFolder(item)}
                    >
                      <Edit2 size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="p-2"
                      onPress={() => confirmDeleteFolder(item.id)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-500 py-4">
                  No folders yet. Create one below.
                </Text>
              }
              className="max-h-80 mb-4"
            />

            <TouchableOpacity
              className="flex-row items-center justify-center py-3 bg-indigo-50 rounded-lg"
              onPress={() => {
                setEditingFolder(null);
                setNewFolderName("");
                setSelectedColor("#4f46e5");
                setShowEditModal(true);
              }}
            >
              <FolderPlus size={18} color="#4f46e5" />
              <Text className="ml-2 text-indigo-700 font-medium">
                Create New Folder
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create/Edit Folder Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">
                {editingFolder ? "Edit Folder" : "Create New Folder"}
              </Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm font-medium mb-1 text-gray-700">
              Folder Name
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 bg-white mb-4"
              placeholder="Enter folder name"
              value={newFolderName}
              onChangeText={setNewFolderName}
            />

            <Text className="text-sm font-medium mb-2 text-gray-700">
              Folder Color
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={{ backgroundColor: color }}
                  className={`w-10 h-10 rounded-full m-1 items-center justify-center ${selectedColor === color ? "border-2 border-gray-800" : ""}`}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Check size={16} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row justify-end">
              <TouchableOpacity
                className="bg-gray-200 px-4 py-2 rounded-lg mr-2"
                onPress={() => setShowEditModal(false)}
              >
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-indigo-600 px-4 py-2 rounded-lg"
                onPress={
                  editingFolder ? handleUpdateFolder : handleCreateFolder
                }
              >
                <Text className="text-white">
                  {editingFolder ? "Update" : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default JournalFolderSelector;
