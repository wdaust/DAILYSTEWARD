import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
} from "react-native";
import {
  Book,
  CheckCircle,
  Circle,
  ChevronRight,
  BookOpen,
} from "lucide-react-native";

interface DailyReadingProps {
  date?: string;
  scriptureReference?: string;
  verses?: string;
  isCompleted?: boolean;
  progress?: number;
  onComplete?: () => void;
  onPartialComplete?: (progress: number) => void;
}

const DailyReading = ({
  date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }),
  scriptureReference = "Matthew 5:1-16",
  verses = "",
  isCompleted = false,
  progress = 0,
  onComplete = () => {},
  onPartialComplete = () => {},
}: DailyReadingProps) => {
  const [completed, setCompleted] = useState(isCompleted);
  const [readingProgress, setReadingProgress] = useState(progress);
  const [expanded, setExpanded] = useState(false);

  const handleComplete = () => {
    setCompleted(!completed);
    onComplete();
  };

  const handlePartialProgress = (value: number) => {
    setReadingProgress(value);
    onPartialComplete(value);
  };

  return (
    <View className="bg-white rounded-xl p-4 shadow-md w-full">
      {/* Header with date and completion status */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-800">{date}</Text>
        <TouchableOpacity onPress={handleComplete}>
          {completed ? (
            <CheckCircle size={24} color="#4CAF50" />
          ) : (
            <Circle size={24} color="#9CA3AF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Scripture reference */}
      <View className="flex-row items-center mb-3">
        <Book size={20} color="#6B7280" className="mr-2" />
        <Text className="text-base font-semibold text-indigo-700">
          {scriptureReference}
        </Text>
      </View>

      {/* Expandable scripture content */}
      <TouchableOpacity className="mb-3" onPress={() => setExpanded(!expanded)}>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600 flex-1">
            {expanded ? verses : `${verses.substring(0, 100)}...`}
          </Text>
          <ChevronRight
            size={16}
            color="#6B7280"
            style={{ transform: [{ rotate: expanded ? "90deg" : "0deg" }] }}
          />
        </View>
      </TouchableOpacity>

      {/* Mark as complete button */}
      {!completed && (
        <TouchableOpacity
          className="mt-4 bg-indigo-600 py-3 rounded-lg items-center"
          onPress={handleComplete}
        >
          <Text className="text-white font-medium">Mark as Complete</Text>
        </TouchableOpacity>
      )}

      {/* Quick actions */}
      <View className="flex-row justify-between mt-4 pt-3 border-t border-gray-100">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            // Extract book and chapter from scriptureReference
            const parts = scriptureReference.split(" ");
            if (parts.length >= 2) {
              const book = parts[0];
              const chapterPart = parts[1].split(":")[0];
              const chapter = parseInt(chapterPart);

              // Bible book codes for wol.jw.org
              const bibleBookCodes = {
                Genesis: 1,
                Exodus: 2,
                Leviticus: 3,
                Numbers: 4,
                Deuteronomy: 5,
                Joshua: 6,
                Judges: 7,
                Ruth: 8,
                "1 Samuel": 9,
                "2 Samuel": 10,
                "1 Kings": 11,
                "2 Kings": 12,
                "1 Chronicles": 13,
                "2 Chronicles": 14,
                Ezra: 15,
                Nehemiah: 16,
                Esther: 17,
                Job: 18,
                Psalms: 19,
                Proverbs: 20,
                Ecclesiastes: 21,
                "Song of Solomon": 22,
                Isaiah: 23,
                Jeremiah: 24,
                Lamentations: 25,
                Ezekiel: 26,
                Daniel: 27,
                Hosea: 28,
                Joel: 29,
                Amos: 30,
                Obadiah: 31,
                Jonah: 32,
                Micah: 33,
                Nahum: 34,
                Habakkuk: 35,
                Zephaniah: 36,
                Haggai: 37,
                Zechariah: 38,
                Malachi: 39,
                Matthew: 40,
                Mark: 41,
                Luke: 42,
                John: 43,
                Acts: 44,
                Romans: 45,
                "1 Corinthians": 46,
                "2 Corinthians": 47,
                Galatians: 48,
                Ephesians: 49,
                Philippians: 50,
                Colossians: 51,
                "1 Thessalonians": 52,
                "2 Thessalonians": 53,
                "1 Timothy": 54,
                "2 Timothy": 55,
                Titus: 56,
                Philemon: 57,
                Hebrews: 58,
                James: 59,
                "1 Peter": 60,
                "2 Peter": 61,
                "1 John": 62,
                "2 John": 63,
                "3 John": 64,
                Jude: 65,
                Revelation: 66,
              };

              const bookCode = bibleBookCodes[book] || 40; // Default to Matthew if not found
              Linking.openURL(
                `https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/${bookCode}/${chapter}#study=discover`,
              );
            } else {
              // If we can't parse the reference, just open the Bible main page
              Linking.openURL("https://wol.jw.org/en/wol/binav/r1/lp-e");
            }
          }}
        >
          <BookOpen size={16} color="#6B7280" />
          <Text className="ml-1 text-sm text-gray-600">Open in Bible</Text>
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="mr-2 text-sm text-gray-600">Add to favorites</Text>
          <Switch
            value={false}
            trackColor={{ false: "#D1D5DB", true: "#C7D2FE" }}
            thumbColor={false ? "#4F46E5" : "#F3F4F6"}
          />
        </View>
      </View>
    </View>
  );
};

export default DailyReading;
