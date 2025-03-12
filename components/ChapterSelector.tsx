import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { ChevronDown } from "lucide-react-native";

interface ChapterSelectorProps {
  selectedBook: string;
  selectedChapter: number;
  onSelectChapter: (chapter: number) => void;
}

const ChapterSelector = ({
  selectedBook,
  selectedChapter,
  onSelectChapter,
}: ChapterSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Bible book chapter counts
  const bibleChapterCounts = {
    Genesis: 50,
    Exodus: 40,
    Leviticus: 27,
    Numbers: 36,
    Deuteronomy: 34,
    Joshua: 24,
    Judges: 21,
    Ruth: 4,
    "1 Samuel": 31,
    "2 Samuel": 24,
    "1 Kings": 22,
    "2 Kings": 25,
    "1 Chronicles": 29,
    "2 Chronicles": 36,
    Ezra: 10,
    Nehemiah: 13,
    Esther: 10,
    Job: 42,
    Psalms: 150,
    Proverbs: 31,
    Ecclesiastes: 12,
    "Song of Solomon": 8,
    Isaiah: 66,
    Jeremiah: 52,
    Lamentations: 5,
    Ezekiel: 48,
    Daniel: 12,
    Hosea: 14,
    Joel: 3,
    Amos: 9,
    Obadiah: 1,
    Jonah: 4,
    Micah: 7,
    Nahum: 3,
    Habakkuk: 3,
    Zephaniah: 3,
    Haggai: 2,
    Zechariah: 14,
    Malachi: 4,
    Matthew: 28,
    Mark: 16,
    Luke: 24,
    John: 21,
    Acts: 28,
    Romans: 16,
    "1 Corinthians": 16,
    "2 Corinthians": 13,
    Galatians: 6,
    Ephesians: 6,
    Philippians: 4,
    Colossians: 4,
    "1 Thessalonians": 5,
    "2 Thessalonians": 3,
    "1 Timothy": 6,
    "2 Timothy": 4,
    Titus: 3,
    Philemon: 1,
    Hebrews: 13,
    James: 5,
    "1 Peter": 5,
    "2 Peter": 3,
    "1 John": 5,
    "2 John": 1,
    "3 John": 1,
    Jude: 1,
    Revelation: 22,
  };

  // Get the number of chapters for the selected book
  const chapterCount = bibleChapterCounts[selectedBook] || 28; // Default to Matthew's 28 chapters

  // Generate array of chapter numbers
  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  const handleSelect = (chapter: number) => {
    onSelectChapter(chapter);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        className="flex-1 border border-gray-300 rounded-md p-2 bg-white flex-row justify-between items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-gray-700">{selectedChapter}</Text>
        <ChevronDown size={16} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl max-h-[70%]">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-center">
                Select Chapter
              </Text>
              <Text className="text-center text-gray-500">
                {selectedBook} has {chapterCount} chapters
              </Text>
            </View>
            <ScrollView className="p-4">
              <View className="flex-row flex-wrap justify-center">
                {chapters.map((chapter) => (
                  <TouchableOpacity
                    key={chapter}
                    className={`w-16 h-16 m-1 rounded-lg items-center justify-center ${selectedChapter === chapter ? "bg-blue-100" : "bg-gray-100"}`}
                    onPress={() => handleSelect(chapter)}
                  >
                    <Text
                      className={`${selectedChapter === chapter ? "text-blue-700 font-medium" : "text-gray-700"}`}
                    >
                      {chapter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity
              className="p-4 border-t border-gray-200 bg-gray-100"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center font-medium text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChapterSelector;
