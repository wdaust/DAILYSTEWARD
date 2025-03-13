import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Linking,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import {
  Settings,
  Calendar,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Plus,
  Minus,
  TrendingUp,
  BookText,
  X,
  Save,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Bell,
} from "lucide-react-native";
import ReadingProgress from "../components/ReadingProgress";
import DailyReading from "../components/DailyReading";
import ReadingHistory from "../components/ReadingHistory";
import BottomNavigation from "../components/BottomNavigation";
import BibleBookSelector from "../components/BibleBookSelector";
import ChapterSelector from "../components/ChapterSelector";
import { useReadingHistory } from "../lib/hooks/useReadingHistory";

export default function BibleReadingScreen() {
  // State for tracking method and reading progress
  const [trackingMethod, setTrackingMethod] = useState<
    "chapter" | "page" | "verse" | "timer"
  >("chapter");
  const [dailyReadingCompleted, setDailyReadingCompleted] = useState(false);

  // Calculate reading stats from user data
  const calculateReadingStats = () => {
    if (
      !readingHistory ||
      !Array.isArray(readingHistory) ||
      readingHistory.length === 0 ||
      readingHistoryLoading
    ) {
      return { progress: 0, streak: 0, completionRate: 0, chaptersRead: 0 };
    }

    // Sort reading history by date (newest first)
    const sortedHistory = [...readingHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Calculate streak (consecutive days with completed readings)
    let streak = 0;
    const today = new Date().toISOString().split("T")[0];
    let currentDate = new Date(today);

    for (let i = 0; i < sortedHistory.length; i++) {
      const historyDate = new Date(sortedHistory[i].date);
      const timeDiff = Math.abs(currentDate.getTime() - historyDate.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (diffDays === 1 && sortedHistory[i].completed) {
        streak++;
        currentDate = historyDate;
      } else {
        break;
      }
    }

    // Calculate completion rate
    const completedDays = sortedHistory.filter((day) => day.completed).length;
    const completionRate =
      sortedHistory.length > 0
        ? Math.round((completedDays / sortedHistory.length) * 100)
        : 0;

    // Estimate chapters read (this is a simplification)
    const chaptersRead = completedDays * 3; // Assuming average of 3 chapters per completed day

    // Calculate overall progress (out of 1189 chapters in the Bible)
    const progress = chaptersRead / 1189;

    return { progress, streak, completionRate, chaptersRead };
  };

  // Initialize state variables for reading stats
  const [readingProgress, setReadingProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [chaptersRead, setChaptersRead] = useState(0);
  const [showSettings, setShowSettings] = useState(true);
  const [historyViewMode, setHistoryViewMode] = useState<
    "week" | "month" | "year"
  >("week");

  // Journal entry state
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [currentReading, setCurrentReading] = useState("");

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

  // Use the reading history hook
  const {
    data: readingHistory,
    isLoading: readingHistoryLoading,
    addData: addReadingHistory,
    updateData: updateReadingHistory,
  } = useReadingHistory();

  // Update stats when reading history changes
  useEffect(() => {
    if (!readingHistoryLoading && Array.isArray(readingHistory)) {
      const stats = calculateReadingStats();
      setReadingProgress(stats.progress);
      setStreak(stats.streak);
      setCompletionRate(stats.completionRate);
      setChaptersRead(stats.chaptersRead);
    }
  }, [readingHistory, readingHistoryLoading]);

  // Journal gem prompts
  const [gemPrompts, setGemPrompts] = useState([
    "What spiritual gem did you find in this scripture?",
    "What practical lesson can you apply from today's reading?",
    "How does this reading strengthen your faith?",
    "What quality of Jehovah is highlighted in this passage?",
    "How might you share this gem with others?",
    "What connection do you see between this reading and modern life?",
    "What scripture in this reading stood out to you the most?",
    "How does this reading help you draw closer to Jehovah?",
    "What did you learn about Jesus from this reading?",
    "How can you apply this gem in your ministry?",
  ]);

  // State for custom prompt
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  const [newPrompt, setNewPrompt] = useState("");

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

  // Get random gem prompt
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * gemPrompts.length);
    return gemPrompts[randomIndex];
  };

  // Add custom prompt
  const addCustomPrompt = () => {
    if (newPrompt.trim()) {
      setGemPrompts([...gemPrompts, newPrompt.trim()]);
      setNewPrompt("");
    }
  };

  // Remove prompt
  const removePrompt = (index) => {
    const updatedPrompts = [...gemPrompts];
    updatedPrompts.splice(index, 1);
    setGemPrompts(updatedPrompts);
  };

  // Handler for completing daily reading
  const handleCompleteReading = async (method: string, value: any) => {
    setDailyReadingCompleted(true);
    // Update progress
    setReadingProgress((prev) => Math.min(prev + 0.01, 1));

    // Update streak
    setStreak(streak + 1);

    // Add to reading history in database
    const today = new Date().toISOString().split("T")[0];
    await addReadingHistory({
      date: today,
      completed: true,
      content: value,
      method: method,
    });

    // Update completion rate
    const completedDays =
      readingHistory.filter((day) => day.completed).length + 1; // +1 for today
    const totalDays = readingHistory.length + 1; // +1 for today
    setCompletionRate(Math.round((completedDays / totalDays) * 100));

    // Set current reading for journal entry
    setCurrentReading(value);

    // Show journal modal
    setShowJournalModal(true);

    // Set default journal title based on reading
    setJournalTitle(`Spiritual Gems from ${value}`);

    // Clear previous journal content
    setJournalContent("");
  };

  // Handle timer completion
  const handleTimerComplete = () => {
    const readingValue = `${timerDuration} minute reading session`;
    handleCompleteReading("timer", readingValue);
  };

  // Handle saving journal entry
  const handleSaveJournal = () => {
    // In a real app, this would save the journal entry to a database
    console.log("Journal entry saved:", {
      title: journalTitle,
      content: journalContent,
      reading: currentReading,
      date: new Date().toISOString(),
    });

    // Close the modal
    setShowJournalModal(false);

    // Hide settings after completing
    setShowSettings(false);
  };

  // Open Bible in wol.jw.org
  const openInBible = (book: string, chapter: number) => {
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
  };

  // Handler for partial reading completion
  const handlePartialProgress = (progress: number) => {
    // Update partial progress
    console.log(`Partial progress: ${progress}%`);
  };

  // Handler for selecting a day in the reading history
  const handleSelectDay = (day: any) => {
    console.log("Selected day:", day);
    // In a real implementation, this would show details for the selected day
  };

  // For month view
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Helper function to get days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary-200">
      <Stack.Screen
        options={{
          title: "Bible Reading",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {readingHistoryLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#7E57C2" />
            <Text className="mt-4 text-gray-600">
              Loading your reading history...
            </Text>
          </View>
        ) : (
          <View className="space-y-6">
            {/* Reading Progress Component */}
            <ReadingProgress
              progress={readingProgress}
              daysCompleted={
                Array.isArray(readingHistory)
                  ? readingHistory.filter((day) => day.completed).length
                  : 0
              }
              currentStreak={streak}
              totalChapters={1189}
              chaptersRead={chaptersRead}
              completionRate={completionRate}
              startDate={
                Array.isArray(readingHistory) && readingHistory.length > 0
                  ? readingHistory[readingHistory.length - 1].date
                  : new Date().toISOString().split("T")[0]
              }
            />

            {/* Tracking Method Settings */}
            {showSettings && (
              <View className="bg-white p-4 rounded-xl shadow-sm">
                <Text className="text-xl font-bold text-gray-800 mb-4">
                  Reading Settings
                </Text>

                <Text className="text-base font-medium text-gray-700 mb-2">
                  Tracking Method
                </Text>
                <View className="flex-row flex-wrap mb-4">
                  <TouchableOpacity
                    className={`mr-2 mb-2 px-4 py-2 rounded-lg h-10 items-center justify-center ${trackingMethod === "chapter" ? "bg-primary-600" : "bg-gray-200"}`}
                    onPress={() => setTrackingMethod("chapter")}
                  >
                    <Text
                      className={
                        trackingMethod === "chapter"
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      By Chapter
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`mr-2 mb-2 px-4 py-2 rounded-lg h-10 items-center justify-center ${trackingMethod === "page" ? "bg-primary-600" : "bg-gray-200"}`}
                    onPress={() => setTrackingMethod("page")}
                  >
                    <Text
                      className={
                        trackingMethod === "page"
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      By Page
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`mr-2 mb-2 px-4 py-2 rounded-lg h-10 items-center justify-center ${trackingMethod === "verse" ? "bg-primary-600" : "bg-gray-200"}`}
                    onPress={() => setTrackingMethod("verse")}
                  >
                    <Text
                      className={
                        trackingMethod === "verse"
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      By Chapter & Verse
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`px-4 py-2 rounded-lg h-10 items-center justify-center ${trackingMethod === "timer" ? "bg-primary-600" : "bg-gray-200"}`}
                    onPress={() => setTrackingMethod("timer")}
                  >
                    <Text
                      className={
                        trackingMethod === "timer"
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      By Timer
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-base font-medium text-gray-700 mb-2">
                  Current Reading
                </Text>
                {trackingMethod === "chapter" && (
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-gray-700 mr-2 w-24">Book:</Text>
                      <View className="flex-1">
                        <BibleBookSelector
                          selectedBook={bookInput}
                          onSelectBook={setBookInput}
                        />
                      </View>
                    </View>
                    <View className="flex-row items-center mb-2">
                      <Text className="text-gray-700 mr-2 w-24">
                        Start Chapter:
                      </Text>
                      <View className="flex-1">
                        <ChapterSelector
                          selectedBook={bookInput}
                          selectedChapter={startChapter}
                          onSelectChapter={setStartChapter}
                        />
                      </View>
                    </View>
                    <View className="flex-row items-center mb-2">
                      <Text className="text-gray-700 mr-2 w-24">Chapters:</Text>
                      <View className="flex-row items-center flex-1">
                        <TouchableOpacity
                          onPress={() =>
                            setChapterCount(Math.max(1, chapterCount - 1))
                          }
                          className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                        >
                          <Minus size={20} color="#4b5563" />
                        </TouchableOpacity>
                        <Text className="mx-4 text-lg font-medium">
                          {chapterCount}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setChapterCount(chapterCount + 1)}
                          className="bg-primary-500 w-10 h-10 rounded-full items-center justify-center"
                        >
                          <Plus size={20} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm mt-1">
                      Reading: {bookInput} {startChapter}
                      {chapterCount > 1
                        ? `-${startChapter + chapterCount - 1}`
                        : ""}
                    </Text>
                  </View>
                )}

                {trackingMethod === "page" && (
                  <View className="mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-700">
                        Track multiple pages:
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setTrackingMultiplePages(!trackingMultiplePages)
                        }
                        className={`w-12 h-6 rounded-full ${trackingMultiplePages ? "bg-primary-500" : "bg-gray-300"} items-center justify-center`}
                      >
                        <View
                          className={`w-5 h-5 rounded-full bg-white absolute ${trackingMultiplePages ? "right-1" : "left-1"}`}
                        />
                      </TouchableOpacity>
                    </View>

                    {trackingMultiplePages ? (
                      <View className="flex-row mb-2">
                        <View className="flex-1 mr-2">
                          <Text className="text-gray-700 mb-1">
                            Start Page:
                          </Text>
                          <TextInput
                            className="border border-gray-300 rounded-md p-3 bg-gray-50"
                            value={pageInput}
                            onChangeText={setPageInput}
                            keyboardType="numeric"
                            placeholder="Start page"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-700 mb-1">End Page:</Text>
                          <TextInput
                            className="border border-gray-300 rounded-md p-3 bg-gray-50"
                            value={pageEndInput}
                            onChangeText={setPageEndInput}
                            keyboardType="numeric"
                            placeholder="End page"
                          />
                        </View>
                      </View>
                    ) : (
                      <TextInput
                        className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                        placeholder="Enter page number"
                        value={pageInput}
                        onChangeText={setPageInput}
                        keyboardType="numeric"
                      />
                    )}
                  </View>
                )}

                {trackingMethod === "verse" && (
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-gray-700 mr-2 w-20">Book:</Text>
                      <View className="flex-1">
                        <BibleBookSelector
                          selectedBook={verseBook}
                          onSelectBook={setVerseBook}
                        />
                      </View>
                    </View>
                    <View className="flex-row items-center mb-2">
                      <Text className="text-gray-700 mr-2 w-20">Chapter:</Text>
                      <View className="flex-1">
                        <ChapterSelector
                          selectedBook={verseBook}
                          selectedChapter={verseChapter}
                          onSelectChapter={setVerseChapter}
                        />
                      </View>
                    </View>
                    <View className="flex-row mb-2">
                      <View className="flex-1 mr-2">
                        <Text className="text-gray-700 mb-1">Start Verse:</Text>
                        <TextInput
                          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
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
                          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
                          placeholder="16"
                          value={verseEnd.toString()}
                          onChangeText={(text) =>
                            setVerseEnd(parseInt(text) || verseStart)
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm mt-1">
                      Reading: {verseBook} {verseChapter}:{verseStart}
                      {verseStart !== verseEnd ? `-${verseEnd}` : ""}
                    </Text>
                  </View>
                )}

                {trackingMethod === "timer" && (
                  <View className="mb-4">
                    <View className="items-center mb-4">
                      <View className="w-32 h-32 rounded-full bg-primary-100 items-center justify-center mb-2">
                        <Text className="text-3xl font-bold text-primary-700">
                          {formatTime(timeRemaining)}
                        </Text>
                      </View>
                      <View className="flex-row">
                        {!timerRunning && !timerCompleted && (
                          <TouchableOpacity
                            onPress={startTimer}
                            className="bg-primary-600 w-12 h-12 rounded-full items-center justify-center mr-2"
                          >
                            <Play size={24} color="#ffffff" />
                          </TouchableOpacity>
                        )}
                        {timerRunning && (
                          <TouchableOpacity
                            onPress={pauseTimer}
                            className="bg-orange-500 w-12 h-12 rounded-full items-center justify-center mr-2"
                          >
                            <Pause size={24} color="#ffffff" />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={resetTimer}
                          className="bg-gray-500 w-12 h-12 rounded-full items-center justify-center"
                        >
                          <RotateCcw size={24} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="text-gray-700 mb-2">
                        Timer Duration:
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                          onPress={() => updateTimerDuration(timerDuration - 5)}
                          className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
                          disabled={timerDuration <= 5}
                        >
                          <Minus
                            size={20}
                            color={timerDuration <= 5 ? "#9ca3af" : "#4b5563"}
                          />
                        </TouchableOpacity>
                        <Text className="text-lg font-medium">
                          {timerDuration} minutes
                        </Text>
                        <TouchableOpacity
                          onPress={() => updateTimerDuration(timerDuration + 5)}
                          className="bg-primary-500 w-10 h-10 rounded-full items-center justify-center"
                        >
                          <Plus size={20} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center">
                        <Bell size={20} color="#4b5563" />
                        <Text className="ml-2 text-gray-700">
                          Play alarm sound
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setPlayAlarmSound(!playAlarmSound)}
                        className={`w-12 h-6 rounded-full ${playAlarmSound ? "bg-primary-500" : "bg-gray-300"} items-center justify-center`}
                      >
                        <View
                          className={`w-5 h-5 rounded-full bg-white absolute ${playAlarmSound ? "right-1" : "left-1"}`}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  className={`py-3 rounded-lg items-center ${timerCompleted ? "bg-green-500" : "bg-primary-600"}`}
                  onPress={() => {
                    if (trackingMethod === "timer") {
                      if (timerCompleted) {
                        handleTimerComplete();
                      } else {
                        // If timer is not completed, start it
                        if (!timerRunning) {
                          startTimer();
                        }
                      }
                    } else if (trackingMethod === "chapter") {
                      const endChapter = startChapter + chapterCount - 1;
                      const readingValue =
                        chapterCount > 1
                          ? `${bookInput} ${startChapter}-${endChapter}`
                          : `${bookInput} ${startChapter}`;
                      handleCompleteReading("chapter", readingValue);
                    } else if (trackingMethod === "page") {
                      const pageValue = trackingMultiplePages
                        ? `Pages ${pageInput}-${pageEndInput}`
                        : `Page ${pageInput}`;
                      handleCompleteReading("page", pageValue);
                    } else {
                      const verseValue =
                        verseStart === verseEnd
                          ? `${verseBook} ${verseChapter}:${verseStart}`
                          : `${verseBook} ${verseChapter}:${verseStart}-${verseEnd}`;
                      handleCompleteReading("verse", verseValue);
                    }
                  }}
                >
                  <Text className="text-white font-medium">
                    {trackingMethod === "timer"
                      ? timerCompleted
                        ? "Mark Reading Complete"
                        : timerRunning
                          ? "Timer Running..."
                          : "Start Timer"
                      : "Mark as Complete"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Journal Entry Modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showJournalModal}
              onRequestClose={() => setShowJournalModal(false)}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white rounded-xl w-11/12 max-h-[80%] p-4">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                      <BookText size={24} color="#7E57C2" />
                      <Text className="text-xl font-bold ml-2 text-primary-800">
                        Record Spiritual Gems
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowJournalModal(false)}
                    >
                      <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView className="mb-4">
                    <View className="mb-4">
                      <Text className="text-sm font-medium mb-1 text-gray-700">
                        Title
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-gray-50"
                        placeholder="Enter title"
                        value={journalTitle}
                        onChangeText={setJournalTitle}
                      />
                    </View>

                    <View className="mb-4 bg-primary-50 p-3 rounded-lg">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-primary-700 font-medium">
                          Spiritual Gem:
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            setShowPromptSettings(!showPromptSettings)
                          }
                          className="bg-primary-100 px-2 py-1 rounded-md"
                        >
                          <Text className="text-primary-700 text-xs">
                            Manage Prompts
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text className="text-primary-600">
                        {getRandomPrompt()}
                      </Text>
                    </View>

                    {showPromptSettings && (
                      <View className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <Text className="text-gray-700 font-medium mb-2">
                          Manage Gem Prompts
                        </Text>

                        <View className="flex-row mb-2">
                          <TextInput
                            className="flex-1 border border-gray-300 rounded-l-md p-2 bg-white"
                            placeholder="Add new prompt"
                            value={newPrompt}
                            onChangeText={setNewPrompt}
                          />
                          <TouchableOpacity
                            className="bg-primary-600 px-3 items-center justify-center rounded-r-md"
                            onPress={addCustomPrompt}
                          >
                            <Text className="text-white">Add</Text>
                          </TouchableOpacity>
                        </View>

                        <ScrollView className="max-h-32 mb-2">
                          {gemPrompts.map((prompt, index) => (
                            <View
                              key={index}
                              className="flex-row justify-between items-center py-2 border-b border-gray-200"
                            >
                              <Text
                                className="flex-1 text-gray-700 text-sm"
                                numberOfLines={1}
                              >
                                {prompt}
                              </Text>
                              <TouchableOpacity
                                onPress={() => removePrompt(index)}
                              >
                                <X size={16} color="#EF4444" />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    <View className="mb-4">
                      <Text className="text-sm font-medium mb-1 text-gray-700">
                        Your Spiritual Gems
                      </Text>
                      <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-gray-50"
                        placeholder="Write about the gems you found in your reading..."
                        multiline
                        numberOfLines={8}
                        textAlignVertical="top"
                        value={journalContent}
                        onChangeText={setJournalContent}
                      />
                    </View>

                    <View className="mb-4 bg-primary-50 p-3 rounded-lg">
                      <Text className="text-sm font-medium mb-1 text-gray-700">
                        Today's Reading
                      </Text>
                      <Text className="text-primary-700">{currentReading}</Text>
                    </View>
                  </ScrollView>

                  <View className="flex-row justify-end">
                    <TouchableOpacity
                      className="bg-gray-200 px-4 py-2 rounded-lg mr-2"
                      onPress={() => setShowJournalModal(false)}
                    >
                      <Text className="text-gray-700">Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-primary-600 px-4 py-2 rounded-lg flex-row items-center"
                      onPress={handleSaveJournal}
                    >
                      <Save size={18} color="#FFFFFF" />
                      <Text className="text-white ml-1">Save Entry</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Reading History Component */}
            <View>
              <Text className="text-xl font-bold text-gray-800 mb-2">
                Reading History
              </Text>

              {Array.isArray(readingHistory) && readingHistory.length === 0 ? (
                <View className="bg-white rounded-lg shadow-sm p-6 items-center justify-center">
                  <Calendar size={48} color="#9CA3AF" />
                  <Text className="text-lg font-bold text-gray-700 mt-4">
                    No Reading History Yet
                  </Text>
                  <Text className="text-gray-500 text-center mt-2">
                    Your reading history will appear here once you start
                    tracking your Bible reading.
                  </Text>
                </View>
              ) : (
                <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  {/* View Mode Selector */}
                  <View className="flex-row mb-4">
                    <TouchableOpacity
                      className={`flex-1 py-2 mr-1 rounded-md ${historyViewMode === "week" ? "bg-primary-600" : "bg-gray-200"}`}
                      onPress={() => setHistoryViewMode("week")}
                    >
                      <Text
                        className={`text-center ${historyViewMode === "week" ? "text-white" : "text-gray-700"} font-medium`}
                      >
                        Week
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 py-2 mx-1 rounded-md ${historyViewMode === "month" ? "bg-primary-600" : "bg-gray-200"}`}
                      onPress={() => setHistoryViewMode("month")}
                    >
                      <Text
                        className={`text-center ${historyViewMode === "month" ? "text-white" : "text-gray-700"} font-medium`}
                      >
                        Month
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`flex-1 py-2 ml-1 rounded-md ${historyViewMode === "year" ? "bg-primary-600" : "bg-gray-200"}`}
                      onPress={() => setHistoryViewMode("year")}
                    >
                      <Text
                        className={`text-center ${historyViewMode === "year" ? "text-white" : "text-gray-700"} font-medium`}
                      >
                        Year
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Reading History Tiles - Only show actual data */}
                  {historyViewMode === "week" && (
                    <View className="mb-4">
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-500 text-xs">Mon</Text>
                        <Text className="text-gray-500 text-xs">Tue</Text>
                        <Text className="text-gray-500 text-xs">Wed</Text>
                        <Text className="text-gray-500 text-xs">Thu</Text>
                        <Text className="text-gray-500 text-xs">Fri</Text>
                        <Text className="text-gray-500 text-xs">Sat</Text>
                        <Text className="text-gray-500 text-xs">Sun</Text>
                      </View>

                      {/* Generate week view based on actual reading history */}
                      {Array.from({ length: 3 }).map((_, weekIndex) => {
                        const today = new Date();
                        today.setDate(today.getDate() - weekIndex * 7);
                        const weekStart = new Date(today);
                        weekStart.setDate(today.getDate() - today.getDay());

                        return (
                          <View
                            key={`week-${weekIndex}`}
                            className="flex-row justify-between mb-2"
                          >
                            {Array.from({ length: 7 }).map((_, dayIndex) => {
                              const date = new Date(weekStart);
                              date.setDate(weekStart.getDate() + dayIndex);
                              const dateString = date
                                .toISOString()
                                .split("T")[0];
                              const dayData = readingHistory.find(
                                (day) => day.date === dateString,
                              );
                              const completed = dayData?.completed || false;

                              return (
                                <TouchableOpacity
                                  key={`day-${weekIndex}-${dayIndex}`}
                                  className={`w-10 h-10 rounded-lg items-center justify-center ${completed ? "bg-green-500" : "bg-gray-100"}`}
                                  onPress={() =>
                                    dayData &&
                                    console.log(`Pressed day ${dateString}`)
                                  }
                                />
                              );
                            })}
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {/* Month View - Only show actual data */}
                  {historyViewMode === "month" && (
                    <View className="mb-4">
                      <View className="flex-row flex-wrap justify-between">
                        {Array.from({
                          length: getDaysInMonth(currentMonth, currentYear),
                        }).map((_, i) => {
                          const day = i + 1;
                          const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          const dayData = readingHistory.find(
                            (item) => item.date === dateString,
                          );
                          const completed = dayData?.completed || false;

                          return (
                            <TouchableOpacity
                              key={`month-day-${i}`}
                              className={`w-10 h-10 rounded-lg items-center justify-center m-1 ${completed ? "bg-green-500" : "bg-gray-100"}`}
                            >
                              <Text
                                className={`text-xs ${completed ? "text-white" : "text-gray-700"} font-medium`}
                              >
                                {day}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* Year View - Only show actual data */}
                  {historyViewMode === "year" && (
                    <View className="mb-4">
                      {[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].map((month, index) => {
                        // Calculate actual completion for this month
                        const monthData = readingHistory.filter((day) => {
                          const date = new Date(day.date);
                          return (
                            date.getMonth() === index &&
                            date.getFullYear() === currentYear
                          );
                        });

                        const completedDays = monthData.filter(
                          (day) => day.completed,
                        ).length;
                        const totalDays = monthData.length;
                        const daysInMonth = new Date(
                          currentYear,
                          index + 1,
                          0,
                        ).getDate();

                        return (
                          <View
                            key={`year-month-${index}`}
                            className="flex-row justify-between items-center mb-2 p-2 bg-gray-50 rounded-lg"
                          >
                            <Text className="text-gray-700 w-16">{month}</Text>
                            <View className="flex-1 mx-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                              <View
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                  width:
                                    totalDays > 0
                                      ? `${(completedDays / totalDays) * 100}%`
                                      : "0%",
                                }}
                              />
                            </View>
                            <Text className="text-gray-700 text-xs">
                              {completedDays}/
                              {totalDays > 0 ? totalDays : daysInMonth}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="w-4 h-4 rounded-sm bg-green-500 mr-1" />
                      <Text className="text-xs text-gray-600">Completed</Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-4 h-4 rounded-sm bg-gray-100 mr-1" />
                      <Text className="text-xs text-gray-600">Not Read</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeRoute="/bible-reading" />
    </SafeAreaView>
  );
}
