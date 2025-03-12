import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Search,
  Tag,
  Folder,
  Filter,
  X,
} from "lucide-react-native";
import { JournalFolder } from "./JournalFolderSelector";

interface ScriptureTag {
  id: string;
  reference: string;
}

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  preview: string;
  scriptures: string[];
  folder?: JournalFolder | null;
  tags?: ScriptureTag[];
}

interface JournalListProps {
  entries?: JournalEntry[];
  onSelectEntry?: (entry: JournalEntry) => void;
  folders?: JournalFolder[];
}

const JournalList = ({
  entries = [],

  onSelectEntry = () => {},
  folders = [
    { id: "1", name: "Spiritual Gems", color: "#7E57C2" },
    { id: "2", name: "Meeting Notes", color: "#10b981" },
    { id: "3", name: "Ministry Experiences", color: "#f59e0b" },
    { id: "4", name: "Personal Reflections", color: "#8b5cf6" },
  ],
}: JournalListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEntries, setFilteredEntries] = useState(entries);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags from entries
  const allTags = entries
    .flatMap((entry) => entry.tags || [])
    .filter(
      (tag, index, self) => index === self.findIndex((t) => t.id === tag.id),
    );

  useEffect(() => {
    let filtered = entries;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.scriptures.some((scripture) =>
            scripture.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply folder filter
    if (selectedFolder) {
      filtered = filtered.filter(
        (entry) => entry.folder?.id === selectedFolder,
      );
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter((entry) =>
        entry.tags?.some((tag) => tag.reference === selectedTag),
      );
    }

    setFilteredEntries(filtered);
  }, [searchQuery, entries, selectedFolder, selectedTag]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderJournalEntry = ({ item }: { item: JournalEntry }) => (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-secondary-200"
      onPress={() => onSelectEntry(item)}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          <Calendar size={16} color="#7E57C2" />
          <Text className="text-neutral-500 text-xs ml-1">
            {formatDate(item.date)}
          </Text>
        </View>
        {item.folder && (
          <View
            style={{ backgroundColor: item.folder.color + "20" }} // 20 is hex for 12% opacity
            className="rounded-full px-2 py-0.5 flex-row items-center"
          >
            <Folder size={12} color={item.folder.color} />
            <Text style={{ color: item.folder.color }} className="text-xs ml-1">
              {item.folder.name}
            </Text>
          </View>
        )}
        <ChevronRight size={18} color="#7E57C2" />
      </View>

      <Text className="text-lg font-semibold mt-2 text-neutral-800">
        {item.title}
      </Text>
      <Text className="text-neutral-600 mt-1 text-sm" numberOfLines={2}>
        {item.preview}
      </Text>

      {item.tags && item.tags.length > 0 && (
        <View className="flex-row mt-3 flex-wrap">
          {item.tags.map((tag, index) => (
            <View
              key={index}
              className="bg-primary-50 rounded-full px-3 py-1 mr-2 mb-1 flex-row items-center"
            >
              <Tag size={12} color="#7E57C2" />
              <Text className="text-primary-700 text-xs ml-1">
                {tag.reference}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  const clearFilters = () => {
    setSelectedFolder(null);
    setSelectedTag(null);
  };

  return (
    <View className="flex-1 bg-secondary-200" style={{ height: "100%" }}>
      {/* Search Bar */}
      <View className="px-4 py-3 bg-white border-b border-secondary-300">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center bg-secondary-100 rounded-full px-3 py-2 flex-1 mr-2">
            <Search size={18} color="#7E57C2" />
            <TextInput
              className="flex-1 ml-2 text-neutral-700"
              placeholder="Search journal entries..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={16} color="#7E57C2" />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            className="p-2 bg-primary-50 rounded-full"
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color="#7E57C2" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View className="mb-2">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-medium text-neutral-700">Filter by:</Text>
              {(selectedFolder || selectedTag) && (
                <TouchableOpacity onPress={clearFilters}>
                  <Text className="text-primary-600 text-sm">
                    Clear filters
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Folder filters */}
            <Text className="text-sm text-neutral-600 mb-1">Folders:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {folders.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={{
                    backgroundColor:
                      selectedFolder === folder.id
                        ? folder.color
                        : folder.color + "20",
                  }}
                  className="rounded-full px-3 py-1 mr-2 flex-row items-center"
                  onPress={() =>
                    setSelectedFolder(
                      selectedFolder === folder.id ? null : folder.id,
                    )
                  }
                >
                  <Folder
                    size={14}
                    color={
                      selectedFolder === folder.id ? "#ffffff" : folder.color
                    }
                  />
                  <Text
                    className={`ml-1 text-sm ${selectedFolder === folder.id ? "text-white" : ""}`}
                    style={
                      selectedFolder !== folder.id
                        ? { color: folder.color }
                        : undefined
                    }
                  >
                    {folder.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Tag filters */}
            <Text className="text-sm text-neutral-600 mb-1">
              Scripture Tags:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {allTags.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  className={`rounded-full px-3 py-1 mr-2 flex-row items-center ${selectedTag === tag.reference ? "bg-primary-600" : "bg-primary-50"}`}
                  onPress={() =>
                    setSelectedTag(
                      selectedTag === tag.reference ? null : tag.reference,
                    )
                  }
                >
                  <Tag
                    size={14}
                    color={
                      selectedTag === tag.reference ? "#ffffff" : "#7E57C2"
                    }
                  />
                  <Text
                    className={`ml-1 text-sm ${selectedTag === tag.reference ? "text-white" : "text-primary-700"}`}
                  >
                    {tag.reference}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Journal Entries List */}
      {filteredEntries.length > 0 ? (
        <FlatList
          data={filteredEntries}
          renderItem={renderJournalEntry}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <BookOpen size={48} color="#9CA3AF" />
          <Text className="text-lg font-bold text-neutral-700 mt-4">
            {entries.length > 0
              ? "No Matching Entries"
              : "No Journal Entries Yet"}
          </Text>
          <Text className="text-neutral-500 text-center mt-2">
            {entries.length > 0
              ? "Try adjusting your search or filters to find more entries."
              : "Start recording your spiritual thoughts and reflections to see them here."}
          </Text>
          {entries.length === 0 && (
            <TouchableOpacity
              className="mt-6 bg-primary-600 px-6 py-3 rounded-full"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold">Create First Entry</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default JournalList;
