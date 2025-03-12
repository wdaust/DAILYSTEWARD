import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { BookOpen, Plus, Folder } from "lucide-react-native";
import JournalList from "../components/JournalList";
import JournalEntry from "../components/JournalEntry";
import BottomNavigation from "../components/BottomNavigation";
import {
  useJournalEntries,
  JournalEntry as JournalEntryType,
} from "../lib/hooks/useJournalEntries";
import { useFolders } from "../lib/hooks/useFolders";
import { JournalFolder } from "../components/JournalFolderSelector";

export default function JournalScreen() {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryType | null>(
    null,
  );

  // Use hooks to fetch user-specific data
  const {
    data: entries,
    isLoading: entriesLoading,
    addData: addEntry,
    updateData: updateEntry,
    deleteData: deleteEntry,
  } = useJournalEntries();

  const {
    data: folders,
    isLoading: foldersLoading,
    addData: addFolder,
    updateData: updateFolder,
    deleteData: deleteFolder,
  } = useFolders();

  const isLoading = entriesLoading || foldersLoading;

  const handleSelectEntry = (entry: JournalEntry) => {
    if (!entry) return;
    setSelectedEntry(entry);
    setShowEntryForm(true);
  };

  const handleCreateEntry = () => {
    setSelectedEntry(null);
    setShowEntryForm(true);
  };

  const handleSaveEntry = async (entryData: {
    title: string;
    content: string;
    scriptureTags: { id: string; reference: string }[];
    folder?: JournalFolder | null;
  }) => {
    if (!entryData || !entryData.title || !entryData.content) return;

    if (selectedEntry) {
      // Update existing entry
      const updates = {
        title: entryData.title,
        content: entryData.content,
        preview: entryData.content.substring(0, 100) + "...",
        scriptures: entryData.scriptureTags.map((tag) => tag.reference),
        folder: entryData.folder,
        tags: entryData.scriptureTags,
      };

      await updateEntry(selectedEntry.id, updates);
    } else {
      // Create new entry
      const newEntry = {
        date: new Date().toISOString().split("T")[0],
        title: entryData.title,
        content: entryData.content,
        preview: entryData.content.substring(0, 100) + "...",
        scriptures: entryData.scriptureTags.map((tag) => tag.reference),
        folder: entryData.folder,
        tags: entryData.scriptureTags,
      };

      await addEntry(newEntry);
    }
    setShowEntryForm(false);
    setSelectedEntry(null);
  };

  const handleCloseEntry = () => {
    setShowEntryForm(false);
    setSelectedEntry(null);
  };

  const handleCreateFolder = async (folder: JournalFolder) => {
    if (!folder || !folder.name) return;
    await addFolder(folder);
  };

  const handleUpdateFolder = async (updatedFolder: JournalFolder) => {
    if (!updatedFolder || !updatedFolder.id || !updatedFolder.name) return;

    await updateFolder(updatedFolder.id, updatedFolder);

    // Update entries that use this folder
    if (entries && entries.length > 0) {
      for (const entry of entries) {
        if (entry.folder?.id === updatedFolder.id) {
          await updateEntry(entry.id, {
            folder: updatedFolder,
          });
        }
      }
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!folderId) return;

    // Remove folder from database
    await deleteFolder(folderId);

    // Update entries that use this folder
    if (entries && entries.length > 0) {
      for (const entry of entries) {
        if (entry.folder?.id === folderId) {
          await updateEntry(entry.id, {
            folder: null,
          });
        }
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary-200">
      <Stack.Screen
        options={{
          title: "Spiritual Journal",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTitleStyle: { color: "#7E57C2", fontWeight: "bold" },
          headerRight: () => (
            <TouchableOpacity onPress={handleCreateEntry} className="mr-4">
              <Plus size={24} color="#7E57C2" />
            </TouchableOpacity>
          ),
        }}
      />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#7E57C2" />
          <Text className="mt-4 text-neutral-600">Loading your journal...</Text>
        </View>
      ) : showEntryForm ? (
        <JournalEntry
          entry={
            selectedEntry
              ? {
                  id: selectedEntry.id,
                  title: selectedEntry.title,
                  content:
                    selectedEntry.content ||
                    selectedEntry.preview.replace("...", ""),
                  date: selectedEntry.date,
                  scriptureTags:
                    selectedEntry.tags ||
                    selectedEntry.scriptures.map((scripture) => ({
                      id: scripture,
                      reference: scripture,
                    })),
                  folder: selectedEntry.folder,
                }
              : undefined
          }
          onSave={handleSaveEntry}
          onClose={handleCloseEntry}
          folders={folders}
          onFolderCreate={handleCreateFolder}
          onFolderUpdate={handleUpdateFolder}
          onFolderDelete={handleDeleteFolder}
        />
      ) : (
        <View className="flex-1" style={{ height: "100%" }}>
          <JournalList
            entries={entries}
            onSelectEntry={handleSelectEntry}
            folders={folders}
          />

          {/* Floating action button */}
          <TouchableOpacity
            onPress={handleCreateEntry}
            className="absolute bottom-6 right-6 bg-primary-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Navigation */}
      {!showEntryForm && <BottomNavigation activeRoute="/journal" />}
    </SafeAreaView>
  );
}
