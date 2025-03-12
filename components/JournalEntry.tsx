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
import RichTextEditor from "./RichTextEditor";
import ScriptureTagSelector from "./ScriptureTagSelector";
import JournalFolderSelector, { JournalFolder } from "./JournalFolderSelector";

interface ScriptureTag {
  id: string;
  reference: string;
}

interface JournalEntryProps {
  entry?: {
    id: string;
    title: string;
    content: string;
    date: string;
    scriptureTags: ScriptureTag[];
    folder?: JournalFolder | null;
  };
  onSave?: (entry: {
    title: string;
    content: string;
    scriptureTags: ScriptureTag[];
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
    scriptureTags: [],
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
  const [scriptureTags, setScriptureTags] = useState<ScriptureTag[]>(
    entry.scriptureTags,
  );
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
      scriptureTags,
      folder: selectedFolder,
    });
  };

  const showFormattingHelp = () => {
    Alert.alert(
      "Formatting Help",
      "Use the toolbar buttons to format your text:\n\n" +
        "• Bold: Makes text bold\n" +
        "• Italic: Makes text italic\n" +
        "• Underline: Underlines text\n" +
        "• H1/H2: Creates headings\n" +
        "• List: Creates bullet points\n" +
        "• Numbered List: Creates numbered lists\n" +
        "• Quote: Creates a quote block",
    );
  };

  // Insert prompt text into content
  const insertPrompt = (promptText: string) => {
    const newContent = content
      ? `${content}\n\n${promptText}:\n`
      : `${promptText}:\n`;
    setContent(newContent);
  };

  // Suggested tags based on content
  const suggestedTags = [
    { id: "s1", reference: "Matthew 5:3-12" },
    { id: "s2", reference: "John 3:16" },
    { id: "s3", reference: "Psalm 23" },
    { id: "s4", reference: "Romans 12:1-2" },
    { id: "s5", reference: "Philippians 4:6-7" },
    { id: "s6", reference: "Proverbs 3:5-6" },
    { id: "s7", reference: "Isaiah 40:31" },
    { id: "s8", reference: "Jeremiah 29:11" },
    { id: "s9", reference: "1 Corinthians 13:4-7" },
    { id: "s10", reference: "Galatians 5:22-23" },
  ];

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
          <TouchableOpacity onPress={handleSave} className="p-2">
            <Save size={24} color="#4f46e5" />
          </TouchableOpacity>
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

        {/* Scripture Tags */}
        <ScriptureTagSelector
          selectedTags={scriptureTags}
          onTagsChange={setScriptureTags}
          suggestedTags={suggestedTags}
        />

        {/* Rich Text Editor */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-sm font-medium text-gray-700">
              Journal Content
            </Text>
            <TouchableOpacity onPress={showFormattingHelp} className="p-1">
              <HelpCircle size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <RichTextEditor
            value={content}
            onChangeText={setContent}
            placeholder="Write your spiritual reflection here..."
            minHeight={200}
          />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default JournalEntry;
