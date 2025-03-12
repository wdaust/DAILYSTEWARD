import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { ChevronDown } from "lucide-react-native";

interface BibleBookSelectorProps {
  selectedBook: string;
  onSelectBook: (book: string) => void;
}

const BibleBookSelector = ({
  selectedBook,
  onSelectBook,
}: BibleBookSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Complete list of Bible books
  const bibleBooks = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation",
  ];

  const handleSelect = (book: string) => {
    onSelectBook(book);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        className="flex-1 border border-gray-300 rounded-md p-2 bg-white flex-row justify-between items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-gray-700">{selectedBook}</Text>
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
              <Text className="text-lg font-bold text-center">Select Book</Text>
            </View>
            <ScrollView className="p-4">
              {bibleBooks.map((book) => (
                <TouchableOpacity
                  key={book}
                  className={`p-3 mb-1 rounded-lg ${selectedBook === book ? "bg-blue-100" : ""}`}
                  onPress={() => handleSelect(book)}
                >
                  <Text
                    className={`${selectedBook === book ? "text-blue-700 font-medium" : "text-gray-700"}`}
                  >
                    {book}
                  </Text>
                </TouchableOpacity>
              ))}
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

export default BibleBookSelector;
