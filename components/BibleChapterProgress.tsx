import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CheckCircle, Circle, Clock, ArrowLeft } from "lucide-react-native";

type ChapterStatus = "complete" | "in-progress" | "not-started";

interface ChapterData {
  number: number;
  status: ChapterStatus;
  verses?: number;
  completedVerses?: number[];
}

interface BibleChapterProgressProps {
  bookId?: string;
  bookName?: string;
  chapters?: ChapterData[];
  onSelectChapter?: (chapterNumber: number) => void;
  onBack?: () => void;
}

const BibleChapterProgress = ({
  bookId = "1",
  bookName = "Genesis",
  chapters = [],
  onSelectChapter = () => {},
  onBack = () => {},
}: BibleChapterProgressProps) => {
  // Generate default chapters if none provided
  const defaultChapters: ChapterData[] = [];
  const chapterCount = getChapterCount(bookId);

  for (let i = 1; i <= chapterCount; i++) {
    defaultChapters.push({
      number: i,
      status: "not-started",
      verses: getVerseCount(bookId, i),
      completedVerses: [],
    });
  }

  // Use provided chapters or default to generated ones
  const bookChapters =
    chapters && chapters.length > 0 ? chapters : defaultChapters;

  // Function to render status icon
  const renderStatusIcon = (status: ChapterStatus) => {
    switch (status) {
      case "complete":
        return <CheckCircle size={16} color="#10b981" />;
      case "in-progress":
        return <Clock size={16} color="#7E57C2" />;
      case "not-started":
      default:
        return <Circle size={16} color="#9CA3AF" />;
    }
  };

  // Function to get background color based on status
  const getBackgroundColor = (status: ChapterStatus) => {
    switch (status) {
      case "complete":
        return "bg-green-100";
      case "in-progress":
        return "bg-primary-100";
      case "not-started":
      default:
        return "bg-gray-700";
    }
  };

  // Function to get text color based on status
  const getTextColor = (status: ChapterStatus) => {
    switch (status) {
      case "complete":
        return "text-green-800";
      case "in-progress":
        return "text-primary-800";
      case "not-started":
      default:
        return "text-white";
    }
  };

  // Handle chapter selection
  const handleSelectChapter = (chapterNumber: number) => {
    setSelectedChapter(chapterNumber);
    onSelectChapter(chapterNumber);
  };

  // Helper function to get chapter count for a book
  function getChapterCount(bookId: string): number {
    const chapterCounts = {
      "1": 50, // Genesis
      "2": 40, // Exodus
      "3": 27, // Leviticus
      "4": 36, // Numbers
      "5": 34, // Deuteronomy
      "6": 24, // Joshua
      "7": 21, // Judges
      "8": 4, // Ruth
      "9": 31, // 1 Samuel
      "10": 24, // 2 Samuel
      "11": 22, // 1 Kings
      "12": 25, // 2 Kings
      "13": 29, // 1 Chronicles
      "14": 36, // 2 Chronicles
      "15": 10, // Ezra
      "16": 13, // Nehemiah
      "17": 10, // Esther
      "18": 42, // Job
      "19": 150, // Psalms
      "20": 31, // Proverbs
      "21": 12, // Ecclesiastes
      "22": 8, // Song of Solomon
      "23": 66, // Isaiah
      "24": 52, // Jeremiah
      "25": 5, // Lamentations
      "26": 48, // Ezekiel
      "27": 12, // Daniel
      "28": 14, // Hosea
      "29": 3, // Joel
      "30": 9, // Amos
      "31": 1, // Obadiah
      "32": 4, // Jonah
      "33": 7, // Micah
      "34": 3, // Nahum
      "35": 3, // Habakkuk
      "36": 3, // Zephaniah
      "37": 2, // Haggai
      "38": 14, // Zechariah
      "39": 4, // Malachi
      "40": 28, // Matthew
      "41": 16, // Mark
      "42": 24, // Luke
      "43": 21, // John
      "44": 28, // Acts
      "45": 16, // Romans
      "46": 16, // 1 Corinthians
      "47": 13, // 2 Corinthians
      "48": 6, // Galatians
      "49": 6, // Ephesians
      "50": 4, // Philippians
      "51": 4, // Colossians
      "52": 5, // 1 Thessalonians
      "53": 3, // 2 Thessalonians
      "54": 6, // 1 Timothy
      "55": 4, // 2 Timothy
      "56": 3, // Titus
      "57": 1, // Philemon
      "58": 13, // Hebrews
      "59": 5, // James
      "60": 5, // 1 Peter
      "61": 3, // 2 Peter
      "62": 5, // 1 John
      "63": 1, // 2 John
      "64": 1, // 3 John
      "65": 1, // Jude
      "66": 22, // Revelation
    };

    return chapterCounts[bookId] || 1;
  }

  // Helper function to get verse count for a chapter
  function getVerseCount(bookId: string, chapter: number): number {
    // This is a simplified version - in a real app, you would have a complete mapping
    // of verses per chapter for each book
    const averageVerses = {
      "1": 30, // Genesis average
      "19": 20, // Psalms average
      "23": 25, // Isaiah average
      "40": 35, // Matthew average
      "43": 35, // John average
      "66": 20, // Revelation average
    };

    return averageVerses[bookId] || 25; // Default to 25 verses if not specified
  }

  return (
    <View className="flex-1 bg-secondary-200 p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={onBack}
          className="p-2 mr-2 bg-white rounded-full"
        >
          <ArrowLeft size={20} color="#7E57C2" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">{bookName}</Text>
      </View>

      <ScrollView>
        <View className="flex-row flex-wrap justify-between">
          {bookChapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.number}
              className={`${getBackgroundColor(chapter.status)} p-3 rounded-lg items-center justify-center w-[23%] aspect-square mb-2`}
              onPress={() => onSelectChapter(chapter.number)}
            >
              <View className="absolute top-1 right-1">
                {renderStatusIcon(chapter.status)}
              </View>
              <Text
                className={`${getTextColor(chapter.status)} text-center font-medium`}
              >
                {chapter.number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend */}
        <View className="mt-6 p-4 bg-white rounded-lg">
          <Text className="text-lg font-semibold mb-2 text-gray-800">
            Legend
          </Text>
          <View className="flex-row items-center mb-2">
            <CheckCircle size={16} color="#10b981" />
            <Text className="ml-2 text-gray-700">Complete</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Clock size={16} color="#7E57C2" />
            <Text className="ml-2 text-gray-700">In Progress</Text>
          </View>
          <View className="flex-row items-center">
            <Circle size={16} color="#9CA3AF" />
            <Text className="ml-2 text-gray-700">Not Started</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BibleChapterProgress;
