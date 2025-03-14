import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BookOpen, ChevronRight } from "lucide-react-native";
import BibleBookProgress from "./BibleBookProgress";
import BibleChapterProgress from "./BibleChapterProgress";
import { useReadingHistory } from "../lib/hooks/useReadingHistory";

type ViewMode = "books" | "chapters" | "verses";

interface BibleReadingTrackerProps {
  onViewDetails?: () => void;
}

const BibleReadingTracker = ({
  onViewDetails = () => {},
}: BibleReadingTrackerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("books");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedBookName, setSelectedBookName] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  // Get reading history data
  const { data: readingHistory, isLoading } = useReadingHistory();

  // State for book and chapter data
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);

  // Process reading history to determine book and chapter status
  useEffect(() => {
    if (!isLoading && readingHistory) {
      processReadingHistory();
    }
  }, [readingHistory, isLoading]);

  // Process reading history to update book and chapter status
  const processReadingHistory = () => {
    if (!readingHistory || readingHistory.length === 0) {
      setBooks([]);
      return;
    }

    // Get the default books structure
    const defaultBooksMap = {};
    const fullNameToShortNameMap = {};
    const defaultBooksArray = [];

    // Create a map of all Bible books with their default status
    for (let i = 1; i <= 66; i++) {
      const shortBookName = getBibleBookName(i);
      const fullBookName = getFullBibleBookName(i);
      const chapterCount = getChapterCount(i.toString());

      const book = {
        id: i.toString(),
        name: shortBookName,
        status: "not-started",
        chapters: chapterCount,
        completedChapters: [],
      };

      defaultBooksMap[shortBookName] = book;
      defaultBooksMap[fullBookName] = book; // Map both full and short names to the same book object
      fullNameToShortNameMap[fullBookName] = shortBookName;
      defaultBooksArray.push(book);
    }

    // Process reading history to update book statuses
    readingHistory.forEach((entry) => {
      if (entry.completed && entry.method === "chapter") {
        // Parse the content to extract book and chapter information
        const match = entry.content.match(/([\w\s]+)\s+(\d+)(?:-(\d+))?/);
        if (match) {
          const bookName = match[1].trim();
          const startChapter = parseInt(match[2]);
          const endChapter = match[3] ? parseInt(match[3]) : startChapter;

          // Find the book in our map
          const book = defaultBooksMap[bookName];
          if (book) {
            // Mark chapters as completed
            for (let chapter = startChapter; chapter <= endChapter; chapter++) {
              if (!book.completedChapters.includes(chapter)) {
                book.completedChapters.push(chapter);
              }
            }

            // Update book status
            if (book.completedChapters.length === book.chapters) {
              book.status = "complete";
            } else if (book.completedChapters.length > 0) {
              book.status = "in-progress";
            }
          }
        }
      } else if (
        entry.completed &&
        entry.completedChapters &&
        Array.isArray(entry.completedChapters)
      ) {
        // Process completedChapters array if available
        entry.completedChapters.forEach((chapterInfo) => {
          const match = chapterInfo.match(/([\w\s]+)\s+(\d+)/);
          if (match) {
            const bookName = match[1].trim();
            const chapter = parseInt(match[2]);

            // Find the book in our map
            const book = defaultBooksMap[bookName];
            if (book && !book.completedChapters.includes(chapter)) {
              book.completedChapters.push(chapter);

              // Update book status
              if (book.completedChapters.length === book.chapters) {
                book.status = "complete";
              } else if (book.completedChapters.length > 0) {
                book.status = "in-progress";
              }
            }
          }
        });
      }
    });

    // Update the books state with the processed data
    setBooks(defaultBooksArray);
  };

  // Helper function to get Bible book name from ID (shortened versions)
  const getBibleBookName = (id: number): string => {
    const bookNames = [
      "Gen.",
      "Ex.",
      "Lev.",
      "Num.",
      "Deut.",
      "Josh.",
      "Judg.",
      "Ruth",
      "1 Sam.",
      "2 Sam.",
      "1 Ki.",
      "2 Ki.",
      "1 Chr.",
      "2 Chr.",
      "Ezra",
      "Neh.",
      "Est.",
      "Job",
      "Ps.",
      "Prov.",
      "Eccl.",
      "Song",
      "Isa.",
      "Jer.",
      "Lam.",
      "Ezek.",
      "Dan.",
      "Hos.",
      "Joel",
      "Amos",
      "Obad.",
      "Jonah",
      "Mic.",
      "Nah.",
      "Hab.",
      "Zeph.",
      "Hag.",
      "Zech.",
      "Mal.",
      "Matt.",
      "Mark",
      "Luke",
      "John",
      "Acts",
      "Rom.",
      "1 Cor.",
      "2 Cor.",
      "Gal.",
      "Eph.",
      "Phil.",
      "Col.",
      "1 Th.",
      "2 Th.",
      "1 Tim.",
      "2 Tim.",
      "Titus",
      "Phile.",
      "Heb.",
      "Jas.",
      "1 Pet.",
      "2 Pet.",
      "1 John",
      "2 John",
      "3 John",
      "Jude",
      "Rev.",
    ];
    return bookNames[id - 1] || "";
  };

  // Helper function to get full Bible book name from ID (for matching with reading history)
  const getFullBibleBookName = (id: number): string => {
    const bookNames = [
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
    return bookNames[id - 1] || "";
  };

  // Helper function to get chapter count for a book
  const getChapterCount = (bookId: string): number => {
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
  };

  // Handle book selection
  const handleSelectBook = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setSelectedBookId(bookId);
      setSelectedBookName(book.name);

      // Generate chapter data based on the book
      const chapterCount = book.chapters || 1;
      const chapterData = [];

      for (let i = 1; i <= chapterCount; i++) {
        let status = "not-started";
        if (book.completedChapters.includes(i)) {
          status = "complete";
        } else if (
          book.status === "in-progress" &&
          i === Math.max(...book.completedChapters) + 1
        ) {
          status = "in-progress";
        }

        chapterData.push({
          number: i,
          status,
        });
      }

      setChapters(chapterData);
      setViewMode("chapters");
    }
  };

  // Handle chapter selection
  const handleSelectChapter = (chapterNumber: number) => {
    setSelectedChapter(chapterNumber);
    // In a real app, this would navigate to the chapter view or mark it as read
    console.log(`Selected chapter ${chapterNumber} of ${selectedBookName}`);
  };

  // Handle back navigation
  const handleBack = () => {
    if (viewMode === "chapters") {
      setViewMode("books");
      setSelectedBookId(null);
      setSelectedBookName("");
    } else if (viewMode === "verses") {
      setViewMode("chapters");
      setSelectedChapter(null);
    }
  };

  return (
    <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <BookOpen size={20} color="#7E57C2" className="mr-2" />
          <Text className="text-xl font-bold text-gray-800">
            Bible Reading Progress
          </Text>
        </View>
        <TouchableOpacity
          onPress={onViewDetails}
          className="flex-row items-center"
        >
          <Text className="text-primary-600 text-sm mr-1">Details</Text>
          <ChevronRight size={16} color="#7E57C2" />
        </TouchableOpacity>
      </View>

      {viewMode === "books" && (
        <BibleBookProgress
          books={books}
          onSelectBook={handleSelectBook}
          onViewChapters={handleSelectBook}
        />
      )}

      {viewMode === "chapters" && selectedBookId && (
        <BibleChapterProgress
          bookId={selectedBookId}
          bookName={selectedBookName}
          chapters={chapters}
          onSelectChapter={handleSelectChapter}
          onBack={handleBack}
        />
      )}
    </View>
  );
};

export default BibleReadingTracker;
