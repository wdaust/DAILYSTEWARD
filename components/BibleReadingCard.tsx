import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  TextInput,
  Linking,
} from "react-native";
import {
  BookOpen,
  ChevronRight,
  CheckCircle,
  Calendar,
  TrendingUp,
  ChevronDown,
  Plus,
  Minus,
  ExternalLink,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Bell,
} from "lucide-react-native";
import BibleBookSelector from "./BibleBookSelector";
import ChapterSelector from "./ChapterSelector";

interface BibleReadingCardProps {
  progress?: number;
  currentReading?: string;
  isCompleted?: boolean;
  streak?: number;
  completionRate?: number;
  trackingMethod?: "chapter" | "page" | "verse" | "timer";
  onMarkComplete?: (method: string, value: any) => void;
  onViewDetails?: () => void;
  onChangeTrackingMethod?: (
    method: "chapter" | "page" | "verse" | "timer",
  ) => void;
}

const BibleReadingCard = ({
  progress = 0.35,
  currentReading = "Matthew 5:1-16",
  isCompleted = false,
  streak = 7,
  completionRate = 85,
  trackingMethod = "chapter",
  onMarkComplete = () => {},
  onViewDetails = () => {},
  onChangeTrackingMethod = () => {},
}: BibleReadingCardProps) => {
  // Calculate percentage for display
  const progressPercentage = Math.round(progress * 100);
  const [showTrackingOptions, setShowTrackingOptions] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Chapter tracking
  const [bookInput, setBookInput] = useState("Matthew");
  const [startChapter, setStartChapter] = useState(5);
  const [chapterCount, setChapterCount] = useState(1);

  // Page tracking
  const [pageInput, setPageInput] = useState("42");
  const [pageEndInput, setPageEndInput] = useState("43");
  const [trackingMultiplePages, setTrackingMultiplePages] = useState(false);

  // Verse tracking
  const [verseBook, setVerseBook] = useState("Matthew");
  const [verseChapter, setVerseChapter] = useState(5);
  const [verseStart, setVerseStart] = useState(1);
  const [verseEnd, setVerseEnd] = useState(16);

  // Timer tracking
  const [timerDuration, setTimerDuration] = useState(15); // in minutes
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // in seconds
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [playAlarmSound, setPlayAlarmSound] = useState(true);
  const timerRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (timerRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            setTimerCompleted(true);
            // Play alarm sound if enabled
            if (playAlarmSound) {
              // In a real app, this would play a sound
              console.log("ALARM SOUND PLAYING");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!timerRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRunning, timeRemaining, playAlarmSound]);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Start timer
  const startTimer = () => {
    setTimerRunning(true);
  };

  // Pause timer
  const pauseTimer = () => {
    setTimerRunning(false);
  };

  // Reset timer
  const resetTimer = () => {
    setTimerRunning(false);
    setTimeRemaining(timerDuration * 60);
    setTimerCompleted(false);
  };

  // Update timer duration
  const updateTimerDuration = (minutes) => {
    const newDuration = Math.max(1, minutes);
    setTimerDuration(newDuration);
    if (!timerRunning) {
      setTimeRemaining(newDuration * 60);
    }
  };

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

  const handleMarkComplete = () => {
    if (trackingMethod === "chapter") {
      const endChapter = startChapter + chapterCount - 1;
      const readingValue =
        chapterCount > 1
          ? `${bookInput} ${startChapter}-${endChapter}`
          : `${bookInput} ${startChapter}`;
      onMarkComplete("chapter", readingValue);
    } else if (trackingMethod === "page") {
      const pageValue = trackingMultiplePages
        ? `Pages ${pageInput}-${pageEndInput}`
        : `Page ${pageInput}`;
      onMarkComplete("page", pageValue);
    } else if (trackingMethod === "verse") {
      const verseValue =
        verseStart === verseEnd
          ? `${verseBook} ${verseChapter}:${verseStart}`
          : `${verseBook} ${verseChapter}:${verseStart}-${verseEnd}`;
      onMarkComplete("verse", verseValue);
    } else if (trackingMethod === "timer") {
      const readingValue = `${timerDuration} minute reading session`;
      onMarkComplete("timer", readingValue);
    }
  };

  const incrementChapterCount = () => {
    setChapterCount((prev) => prev + 1);
  };

  const decrementChapterCount = () => {
    setChapterCount((prev) => Math.max(1, prev - 1));
  };

  const getCurrentReadingText = () => {
    if (trackingMethod === "chapter") {
      const endChapter = startChapter + chapterCount - 1;
      return chapterCount > 1
        ? `${bookInput} ${startChapter}-${endChapter}`
        : `${bookInput} ${startChapter}`;
    } else if (trackingMethod === "page") {
      return trackingMultiplePages
        ? `Pages: ${pageInput}-${pageEndInput}`
        : `Page: ${pageInput}`;
    } else if (trackingMethod === "verse") {
      return verseStart === verseEnd
        ? `${verseBook} ${verseChapter}:${verseStart}`
        : `${verseBook} ${verseChapter}:${verseStart}-${verseEnd}`;
    } else if (trackingMethod === "timer") {
      return `${timerDuration} minute timer`;
    }
  };

  const openInBible = () => {
    let bookCode;
    let chapter;

    if (trackingMethod === "chapter") {
      bookCode = bibleBookCodes[bookInput] || 40; // Default to Matthew if not found
      chapter = startChapter;
    } else if (trackingMethod === "verse") {
      bookCode = bibleBookCodes[verseBook] || 40;
      chapter = verseChapter;
    } else {
      // For page tracking, we can't determine the exact location
      // So we'll just open the Bible main page
      Linking.openURL("https://wol.jw.org/en/wol/binav/r1/lp-e");
      return;
    }

    // Open the specific chapter
    Linking.openURL(
      `https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/${bookCode}/${chapter}#study=discover`,
    );
  };

  return (
    <View className="bg-white p-5 rounded-2xl shadow-card w-full">
      <TouchableOpacity
        className="flex-row justify-between items-center mb-3"
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        <View className="flex-row items-center">
          <BookOpen size={22} color="#7E57C2" />
          <Text className="text-xl font-semibold ml-2 text-neutral-800">
            Bible Reading
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex-row items-center mr-2"
          >
            <Text className="text-primary-600 text-sm mr-1 font-medium">
              View Details
            </Text>
            <ChevronRight size={16} color="#7E57C2" />
          </TouchableOpacity>
          {isCollapsed ? (
            <ChevronRight size={20} color="#7E57C2" />
          ) : (
            <ChevronDown size={20} color="#7E57C2" />
          )}
        </View>
      </TouchableOpacity>

      {!isCollapsed && (
        <>
          {/* Stats Row */}
          <View className="flex-row justify-between mb-3">
            <View className="flex-row items-center bg-primary-50 px-4 py-2 rounded-xl">
              <Calendar size={16} color="#7E57C2" />
              <Text className="ml-2 text-primary-700 font-medium">
                {streak} day streak
              </Text>
            </View>
            <View className="flex-row items-center bg-primary-50 px-4 py-2 rounded-xl">
              <TrendingUp size={16} color="#7E57C2" />
              <Text className="ml-2 text-primary-700 font-medium">
                {completionRate}% completion
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="mb-3">
            <View className="h-3 w-full bg-secondary-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary-600 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-neutral-500">Progress</Text>
              <Text className="text-xs font-medium text-primary-600">
                {progressPercentage}%
              </Text>
            </View>
          </View>

          {/* Tracking Method Selector */}
          <TouchableOpacity
            className="flex-row justify-between items-center mb-2 bg-secondary-100 p-3 rounded-xl"
            onPress={() => setShowTrackingOptions(!showTrackingOptions)}
          >
            <Text className="text-neutral-700">
              Tracking by:{" "}
              <Text className="font-semibold text-primary-700">
                {trackingMethod.charAt(0).toUpperCase() +
                  trackingMethod.slice(1)}
              </Text>
            </Text>
            {showTrackingOptions ? (
              <ChevronDown size={16} color="#7E57C2" />
            ) : (
              <ChevronRight size={16} color="#7E57C2" />
            )}
          </TouchableOpacity>

          {showTrackingOptions && (
            <View className="mb-4 bg-secondary-100 p-3 rounded-xl">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  className={`mr-2 px-4 py-2 rounded-xl h-10 items-center justify-center ${trackingMethod === "chapter" ? "bg-primary-600" : "bg-secondary-200"}`}
                  onPress={() => onChangeTrackingMethod("chapter")}
                >
                  <Text
                    className={
                      trackingMethod === "chapter"
                        ? "text-white font-medium"
                        : "text-neutral-700"
                    }
                  >
                    By Chapter
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`mr-2 px-4 py-2 rounded-xl h-10 items-center justify-center ${trackingMethod === "page" ? "bg-primary-600" : "bg-secondary-200"}`}
                  onPress={() => onChangeTrackingMethod("page")}
                >
                  <Text
                    className={
                      trackingMethod === "page"
                        ? "text-white font-medium"
                        : "text-neutral-700"
                    }
                  >
                    By Page
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`mr-2 px-4 py-2 rounded-xl h-10 items-center justify-center ${trackingMethod === "verse" ? "bg-primary-600" : "bg-secondary-200"}`}
                  onPress={() => onChangeTrackingMethod("verse")}
                >
                  <Text
                    className={
                      trackingMethod === "verse"
                        ? "text-white font-medium"
                        : "text-neutral-700"
                    }
                  >
                    By Chapter & Verse
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-4 py-2 rounded-xl h-10 items-center justify-center ${trackingMethod === "timer" ? "bg-primary-600" : "bg-secondary-200"}`}
                  onPress={() => onChangeTrackingMethod("timer")}
                >
                  <Text
                    className={
                      trackingMethod === "timer"
                        ? "text-white font-medium"
                        : "text-neutral-700"
                    }
                  >
                    By Timer
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* Reading Input Section */}
          <View className="bg-primary-50 p-4 rounded-xl mb-3">
            <Text className="text-base font-medium text-primary-700 mb-3">
              Today's Reading:
            </Text>

            {trackingMethod === "chapter" && (
              <View>
                <View className="flex-row items-center mb-3">
                  <Text className="text-gray-700 w-24">Book:</Text>
                  <View className="flex-1">
                    <BibleBookSelector
                      selectedBook={bookInput}
                      onSelectBook={setBookInput}
                    />
                  </View>
                </View>
                <View className="flex-row items-center mb-3">
                  <Text className="text-gray-700 w-24">Starting Chapter:</Text>
                  <View className="flex-1">
                    <ChapterSelector
                      selectedBook={bookInput}
                      selectedChapter={startChapter}
                      onSelectChapter={setStartChapter}
                    />
                  </View>
                </View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-700 w-24">
                    Number of Chapters:
                  </Text>
                  <View className="flex-row items-center flex-1 justify-end">
                    <TouchableOpacity
                      onPress={decrementChapterCount}
                      className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                    >
                      <Minus size={18} color="#4b5563" />
                    </TouchableOpacity>
                    <Text className="mx-4 text-lg font-medium">
                      {chapterCount}
                    </Text>
                    <TouchableOpacity
                      onPress={incrementChapterCount}
                      className="bg-primary-600 w-10 h-10 rounded-full items-center justify-center"
                    >
                      <Plus size={18} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {trackingMethod === "page" && (
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-700">Track multiple pages:</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setTrackingMultiplePages(!trackingMultiplePages)
                    }
                    className={`w-10 h-6 rounded-full ${trackingMultiplePages ? "bg-primary-600" : "bg-gray-300"} items-center justify-center`}
                  >
                    <View
                      className={`w-4 h-4 rounded-full bg-white absolute ${trackingMultiplePages ? "right-1" : "left-1"}`}
                    />
                  </TouchableOpacity>
                </View>

                {trackingMultiplePages ? (
                  <View>
                    <View className="flex-row mb-2">
                      <View className="flex-1 mr-2">
                        <Text className="text-gray-700 mb-1">Start Page:</Text>
                        <TextInput
                          className="border border-gray-300 rounded-md p-2 bg-white"
                          value={pageInput}
                          onChangeText={setPageInput}
                          keyboardType="numeric"
                          placeholder="Start page"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-700 mb-1">End Page:</Text>
                        <TextInput
                          className="border border-gray-300 rounded-md p-2 bg-white"
                          value={pageEndInput}
                          onChangeText={setPageEndInput}
                          keyboardType="numeric"
                          placeholder="End page"
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Text className="text-gray-700 mr-2">Page Number:</Text>
                    <TextInput
                      className="flex-1 border border-gray-300 rounded-md p-2 bg-white"
                      value={pageInput}
                      onChangeText={setPageInput}
                      keyboardType="numeric"
                      placeholder="Enter page number"
                    />
                  </View>
                )}
              </View>
            )}

            {trackingMethod === "verse" && (
              <View>
                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-700 mr-2">Book:</Text>
                  <BibleBookSelector
                    selectedBook={verseBook}
                    onSelectBook={setVerseBook}
                  />
                </View>
                <View className="flex-row items-center mb-2">
                  <Text className="text-gray-700 mr-2">Chapter:</Text>
                  <ChapterSelector
                    selectedBook={verseBook}
                    selectedChapter={verseChapter}
                    onSelectChapter={setVerseChapter}
                  />
                </View>
                <View className="flex-row mb-2">
                  <View className="flex-1 mr-2">
                    <Text className="text-gray-700 mb-1">Start Verse:</Text>
                    <TextInput
                      className="border border-gray-300 rounded-md p-2 bg-white"
                      placeholder="1"
                      value={verseStart.toString()}
                      onChangeText={(text) =>
                        setVerseStart(parseInt(text) || 1)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-700 mb-1">End Verse:</Text>
                    <TextInput
                      className="border border-gray-300 rounded-md p-2 bg-white"
                      placeholder="16"
                      value={verseEnd.toString()}
                      onChangeText={(text) =>
                        setVerseEnd(parseInt(text) || verseStart)
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
            )}

            {trackingMethod === "timer" && (
              <View>
                <View className="items-center mb-3">
                  <View className="w-24 h-24 rounded-full bg-primary-100 items-center justify-center mb-2">
                    <Text className="text-2xl font-bold text-primary-700">
                      {formatTime(timeRemaining)}
                    </Text>
                  </View>
                  <View className="flex-row">
                    {!timerRunning && !timerCompleted && (
                      <TouchableOpacity
                        onPress={startTimer}
                        className="bg-primary-600 w-10 h-10 rounded-full items-center justify-center mr-2"
                      >
                        <Play size={20} color="#ffffff" />
                      </TouchableOpacity>
                    )}
                    {timerRunning && (
                      <TouchableOpacity
                        onPress={pauseTimer}
                        className="bg-orange-500 w-10 h-10 rounded-full items-center justify-center mr-2"
                      >
                        <Pause size={20} color="#ffffff" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={resetTimer}
                      className="bg-gray-500 w-10 h-10 rounded-full items-center justify-center"
                    >
                      <RotateCcw size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="mb-2">
                  <Text className="text-gray-700 mb-1">Timer Duration:</Text>
                  <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                      onPress={() => updateTimerDuration(timerDuration - 5)}
                      className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                      disabled={timerDuration <= 5}
                    >
                      <Minus
                        size={16}
                        color={timerDuration <= 5 ? "#9ca3af" : "#4b5563"}
                      />
                    </TouchableOpacity>
                    <Text className="text-base font-medium">
                      {timerDuration} minutes
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateTimerDuration(timerDuration + 5)}
                      className="bg-primary-600 w-8 h-8 rounded-full items-center justify-center"
                    >
                      <Plus size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Bell size={16} color="#4b5563" />
                    <Text className="ml-2 text-sm text-gray-700">
                      Play alarm sound
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPlayAlarmSound(!playAlarmSound)}
                    className={`w-10 h-6 rounded-full ${playAlarmSound ? "bg-primary-600" : "bg-gray-300"} items-center justify-center`}
                  >
                    <View
                      className={`w-4 h-4 rounded-full bg-white absolute ${playAlarmSound ? "right-1" : "left-1"}`}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-primary-100">
              <Text className="text-lg font-semibold text-primary-700">
                {getCurrentReadingText()}
              </Text>

              {(trackingMethod === "chapter" || trackingMethod === "verse") && (
                <TouchableOpacity
                  onPress={openInBible}
                  className="flex-row items-center bg-primary-100 px-3 py-2 rounded-lg"
                >
                  <Text className="text-sm text-primary-700 mr-1">
                    Open in Bible
                  </Text>
                  <ExternalLink size={14} color="#7E57C2" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Action Button */}
          <Pressable
            className={`py-4 rounded-xl flex-row justify-center items-center ${isCompleted ? "bg-green-100" : trackingMethod === "timer" && timerCompleted ? "bg-primary-500" : "bg-primary-600"}`}
            onPress={() => {
              if (trackingMethod === "timer") {
                if (timerCompleted) {
                  handleMarkComplete();
                } else if (!timerRunning) {
                  startTimer();
                }
              } else {
                handleMarkComplete();
              }
            }}
            disabled={isCompleted}
          >
            {isCompleted ? (
              <>
                <CheckCircle size={20} color="#10b981" />
                <Text className="ml-2 font-medium text-green-700 text-lg">
                  Completed
                </Text>
              </>
            ) : trackingMethod === "timer" ? (
              timerCompleted ? (
                <>
                  <CheckCircle size={20} color="#ffffff" />
                  <Text className="ml-2 font-medium text-white text-lg">
                    Mark as Complete
                  </Text>
                </>
              ) : timerRunning ? (
                <>
                  <Clock size={20} color="#ffffff" />
                  <Text className="ml-2 font-medium text-white text-lg">
                    Timer Running...
                  </Text>
                </>
              ) : (
                <>
                  <Play size={20} color="#ffffff" />
                  <Text className="ml-2 font-medium text-white text-lg">
                    Start Timer
                  </Text>
                </>
              )
            ) : (
              <>
                <CheckCircle size={20} color="#ffffff" />
                <Text className="ml-2 font-medium text-white text-lg">
                  Mark as Complete
                </Text>
              </>
            )}
          </Pressable>
        </>
      )}
    </View>
  );
};

export default BibleReadingCard;
