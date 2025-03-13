import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  BookOpen,
  Save,
  X,
  ChevronLeft,
  Folder,
  HelpCircle,
} from "lucide-react-native";
import TagSelector from "./TagSelector";
import JournalFolderSelector, { JournalFolder } from "./JournalFolderSelector";

interface JournalTag {
  id: string;
  name: string;
}

interface JournalEntryProps {
  entry?: {
    id: string;
    title: string;
    content: string;
    date: string;
    tags: JournalTag[];
    folder?: JournalFolder | null;
  };
  onSave?: (entry: {
    title: string;
    content: string;
    tags: JournalTag[];
    folder?: JournalFolder | null;
  }) => void;
  onClose?: () => void;
  folders?: JournalFolder[];
  onFolderCreate?: (folder: JournalFolder) => void;
  onFolderUpdate?: (folder: JournalFolder) => void;
  onFolderDelete?: (folderId: string) => void;
}

const JournalEntry = ({
  entry = {
    id: "1",
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    tags: [],
    folder: null,
  },
  onSave = () => {},
  onClose = () => {},
  folders = [
    { id: "1", name: "Spiritual Gems", color: "#4f46e5" },
    { id: "2", name: "Meeting Notes", color: "#10b981" },
    { id: "3", name: "Ministry Experiences", color: "#f59e0b" },
    { id: "4", name: "Personal Reflections", color: "#8b5cf6" },
  ],
  onFolderCreate = () => {},
  onFolderUpdate = () => {},
  onFolderDelete = () => {},
}: JournalEntryProps) => {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [tags, setTags] = useState<JournalTag[]>(entry.tags);
  const [selectedFolder, setSelectedFolder] = useState<JournalFolder | null>(
    entry.folder || null,
  );

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert(
        "Missing Title",
        "Please enter a title for your journal entry.",
      );
      return;
    }

    onSave({
      title,
      content,
      tags,
      folder: selectedFolder,
    });
  };

  const showFormattingHelp = () => {
    Alert.alert(
      "Formatting Help",
      "You can use basic formatting in your journal entries:\n\n" +
        "• Use *asterisks* for emphasis\n" +
        "• Use **double asterisks** for strong emphasis\n" +
        "• Use - or * at the beginning of a line for bullet points\n" +
        "• Use > at the beginning of a line for quotes\n" +
        "• Use # for headings (more # for smaller headings)\n",
    );
  };

  // Insert prompt text into content
  const insertPrompt = (promptText: string) => {
    const newContent = content
      ? `${content}\n\n${promptText}:\n`
      : `${promptText}:\n`;
    setContent(newContent);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={onClose} className="p-2">
            <ChevronLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-center flex-1">
            {entry.id === "1" ? "New Journal Entry" : "Edit Journal Entry"}
          </Text>
          <View className="w-10" />
        </View>

        {/* Date display */}
        <Text className="text-sm text-gray-500 mb-4">
          {new Date(entry.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        {/* Folder selector */}
        <JournalFolderSelector
          folders={folders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          onFolderCreate={onFolderCreate}
          onFolderUpdate={onFolderUpdate}
          onFolderDelete={onFolderDelete}
        />

        {/* Title input */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1 text-gray-700">Title</Text>
          <TextInput
            className="text-xl font-semibold border border-gray-300 rounded-lg p-3 bg-white"
            placeholder="Entry Title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Tags */}
        <TagSelector selectedTags={tags} onTagsChange={setTags} />

        {/* Simple Text Editor */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm font-medium text-gray-700">
              Journal Content
            </Text>
            <TouchableOpacity onPress={showFormattingHelp} className="p-1">
              <HelpCircle size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <View className="bg-white border border-gray-300 rounded-lg">
            <TextInput
              className="p-3"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              placeholder="Write your spiritual reflection here..."
              value={content}
              onChangeText={setContent}
              style={{ minHeight: 200 }}
            />
          </View>
        </View>

        {/* Spiritual prompts */}
        <View className="mb-6 bg-indigo-50 p-4 rounded-lg">
          <Text className="font-medium mb-2 text-indigo-800">
            Reflection Prompts:
          </Text>
          <TouchableOpacity
            className="mb-2"
            onPress={() =>
              insertPrompt("How did this scripture strengthen my faith")
            }
          >
            <Text className="text-indigo-700">
              • How did this scripture strengthen my faith?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="mb-2"
            onPress={() => insertPrompt("What practical lessons can I apply")}
          >
            <Text className="text-indigo-700">
              • What practical lessons can I apply?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              insertPrompt("How can I share this insight with others")
            }
          >
            <Text className="text-indigo-700">
              • How can I share this insight with others?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className="bg-primary-600 py-4 rounded-xl items-center mb-6"
          onPress={handleSave}
        >
          <Text className="text-white font-medium text-lg">
            Save Journal Entry
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default JournalEntry;
