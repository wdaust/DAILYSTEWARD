import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { CheckCircle, Circle, Clock } from "lucide-react-native";

type BookStatus = "complete" | "in-progress" | "not-started";

interface BibleBook {
  id: string;
  name: string;
  status: BookStatus;
  chapters: number;
  completedChapters: number[];
}

interface BibleBookProgressProps {
  books?: BibleBook[];
  onSelectBook?: (bookId: string) => void;
  onViewChapters?: (bookId: string) => void;
}

const BibleBookProgress = ({
  books = [],
  onSelectBook = () => {},
  onViewChapters = () => {},
}: BibleBookProgressProps) => {
  // Default books with shortened names if none provided
  const defaultBooks: BibleBook[] = [
    // Hebrew-Aramaic Scriptures (Old Testament)
    {
      id: "1",
      name: "Gen.",
      status: "not-started",
      chapters: 50,
      completedChapters: [],
    },
    {
      id: "2",
      name: "Ex.",
      status: "not-started",
      chapters: 40,
      completedChapters: [],
    },
    {
      id: "3",
      name: "Lev.",
      status: "not-started",
      chapters: 27,
      completedChapters: [],
    },
    {
      id: "4",
      name: "Num.",
      status: "not-started",
      chapters: 36,
      completedChapters: [],
    },
    {
      id: "5",
      name: "Deut.",
      status: "not-started",
      chapters: 34,
      completedChapters: [],
    },
    {
      id: "6",
      name: "Josh.",
      status: "not-started",
      chapters: 24,
      completedChapters: [],
    },
    {
      id: "7",
      name: "Judg.",
      status: "not-started",
      chapters: 21,
      completedChapters: [],
    },
    {
      id: "8",
      name: "Ruth",
      status: "not-started",
      chapters: 4,
      completedChapters: [],
    },
    {
      id: "9",
      name: "1 Sam.",
      status: "not-started",
      chapters: 31,
      completedChapters: [],
    },
    {
      id: "10",
      name: "2 Sam.",
      status: "not-started",
      chapters: 24,
      completedChapters: [],
    },
    {
      id: "11",
      name: "1 Ki.",
      status: "not-started",
      chapters: 22,
      completedChapters: [],
    },
    {
      id: "12",
      name: "2 Ki.",
      status: "not-started",
      chapters: 25,
      completedChapters: [],
    },
    {
      id: "13",
      name: "1 Chr.",
      status: "not-started",
      chapters: 29,
      completedChapters: [],
    },
    {
      id: "14",
      name: "2 Chr.",
      status: "not-started",
      chapters: 36,
      completedChapters: [],
    },
    {
      id: "15",
      name: "Ezra",
      status: "not-started",
      chapters: 10,
      completedChapters: [],
    },
    {
      id: "16",
      name: "Neh.",
      status: "not-started",
      chapters: 13,
      completedChapters: [],
    },
    {
      id: "17",
      name: "Est.",
      status: "not-started",
      chapters: 10,
      completedChapters: [],
    },
    {
      id: "18",
      name: "Job",
      status: "not-started",
      chapters: 42,
      completedChapters: [],
    },
    {
      id: "19",
      name: "Ps.",
      status: "not-started",
      chapters: 150,
      completedChapters: [],
    },
    {
      id: "20",
      name: "Prov.",
      status: "not-started",
      chapters: 31,
      completedChapters: [],
    },
    {
      id: "21",
      name: "Eccl.",
      status: "not-started",
      chapters: 12,
      completedChapters: [],
    },
    {
      id: "22",
      name: "Song",
      status: "not-started",
      chapters: 8,
      completedChapters: [],
    },
    {
      id: "23",
      name: "Isa.",
      status: "not-started",
      chapters: 66,
      completedChapters: [],
    },
    {
      id: "24",
      name: "Jer.",
      status: "not-started",
      chapters: 52,
      completedChapters: [],
    },
    {
      id: "25",
      name: "Lam.",
      status: "not-started",
      chapters: 5,
      completedChapters: [],
    },
    {
      id: "26",
      name: "Ezek.",
      status: "not-started",
      chapters: 48,
      completedChapters: [],
    },
    {
      id: "27",
      name: "Dan.",
      status: "not-started",
      chapters: 12,
      completedChapters: [],
    },
    {
      id: "28",
      name: "Hos.",
      status: "not-started",
      chapters: 14,
      completedChapters: [],
    },
    {
      id: "29",
      name: "Joel",
      status: "not-started",
      chapters: 3,
      completedChapters: [],
    },
    {
      id: "30",
      name: "Amos",
      status: "not-started",
      chapters: 9,
      completedChapters: [],
    },
    {
      id: "31",
      name: "Obad.",
      status: "not-started",
      chapters: 1,
      completedChapters: [],
    },
    {
      id: "32",
      name: "Jonah",
      status: "not-started",
      chapters: 4,
      completedChapters: [],
    },
    {
      id: "33",
      name: "Mic.",
      status: "not-started",
      chapters: 7,
      completedChapters: [],
    },
    {
      id: "34",
      name: "Nah.",
      status: "not-started",
      chapters: 3,
      completedChapters: [],
    },
    {
      id: "35",
      name: "Hab.",
      status: "not-started",
      chapters: 3,
      completedChapters: [],
    },
    {
      id: "36",
      name: "Zeph.",
      status: "not-started",
      chapters: 3,
      completedChapters: [],
    },
    {
      id: "37",
      name: "Hag.",
      status: "not-started",
      chapters: 2,
      completedChapters: [],
    },
    {
      id: "38",
      name: "Zech.",
      status: "not-started",
      chapters: 14,
      completedChapters: [],
    },
    {
      id: "39",
      name: "Mal.",
      status: "not-started",
      chapters: 4,
      completedChapters: [],
    },

    // Christian Greek Scriptures (New Testament)
    {
      id: "40",
      name: "Matt.",
      status: "not-started",
      chapters: 28,
      completedChapters: [],
    },
    {
      id: "41",
      name: "Mark",
      status: "not-started",
      chapters: 16,
      completedChapters: [],
    },
    {
      id: "42",
      name: "Luke",
      status: "not-started",
      chapters: 24,
      completedChapters: [],
    },
    {
      id: "43",
      name: "John",
      status: "not-started",
      chapters: 21,
      completedChapters: [],
    },
    {
      id: "44",
      name: "Acts",
      status: "not-started",
      chapters: 28,
      completedChapters: [],
    },
    {
      id: "45",
      name: "Rom.",
      status: "not-started",
      chapters: 16,
      completedChapters: [],
    },
    {
      id: "46",
      name: "1 Cor.",
      status: "not-started",
      chapters: 16,
      completedChapters: [],
    },
    {
      id: "47",
      name: "2 Cor.",
      status: "not-started",
      chapters: 13,
      completedChapters: [],
    },
    {
      id: "48",
      name: "Gal.",
      status: "not-started",
      chapters: 6,
      completedChapters: [],
    },
    {
      id: "49",
      name: "Eph.",
      status: "not-started",
      chapters: 6,
      completedChapters: [],
    },
    {
      id: "50",
      name: "Phil.",
      status: "not-started",
      chapters: 4,
      completedChapters: [],
    },
    {
      id: "51",
      name: "Col.",
      status: "not-started",
      chapters: 4,
      completedChapters: [],
    },
    {
      id: "52",
      name: "1 Th.",
      status: "not-started",
      chapters: 5,
      completedChapters: [],
    },
    {
      id: "53",
      name: "2 Th.",
      status: "not-started",
      chapters: 3,
      completedChapters: [],
    },
    {
      id: "54",
      name: "1 Tim.",
      status: "not-started",
      chapters: 6,
      completedChapters: [],
    },
    {
      id: "55",
      name: "2 Tim.",
      status: "not-started",
      chapters: 4,
      completedChapters: [],
    },
    {
      id: "56",
      name: "Titus",
      status: "not-started",
      chapters: 3,
      completedChapters: [],
    },
    {
      id: "57",
      name: "Phile.",
      status: "not-started",
      chapters: 1,
      completedChapters: [],
    },
    {
      id: "58",
      name: "Heb.",
      status: "not-started",
      chapters: 13,
      completedChapters: [],
    },
    {
      id: "59",
      name: "Jas.",
      status: "not-started",
      chapters: 5,
      completedChapters: [],
    },
    {
      id: "60",
      name: "1 Pet.",
      status: "not-started",
      chapters: 5,
      completedChapters: [],
    },
    {
      id: "61",
      name: "2 Pet.",
      status: "not-started",
      chapters: 3,
      completedChapters: [],
    },
    {
      id: "62",
      name: "1 John",
      status: "not-started",
      chapters: 5,
      completedChapters: [],
    },
    {
      id: "63",
      name: "2 John",
      status: "not-started",
      chapters: 1,
      completedChapters: [],
    },
    {
      id: "64",
      name: "3 John",
      status: "not-started",
      chapters: 1,
      completedChapters: [],
    },
    {
      id: "65",
      name: "Jude",
      status: "not-started",
      chapters: 1,
      completedChapters: [],
    },
    {
      id: "66",
      name: "Rev.",
      status: "not-started",
      chapters: 22,
      completedChapters: [],
    },
  ];

  // Use provided books or default to the complete list
  const bibleBooks = books.length > 0 ? books : defaultBooks;

  // We'll use all books without splitting them

  // Function to render status icon
  const renderStatusIcon = (status: BookStatus) => {
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
  const getBackgroundColor = (status: BookStatus) => {
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
  const getTextColor = (status: BookStatus) => {
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

  // Handle book selection
  const handleSelectBook = (bookId: string) => {
    onViewChapters(bookId);
  };

  // Render a book tile
  const renderBookTile = (book: BibleBook) => (
    <TouchableOpacity
      key={book.id}
      className={`${getBackgroundColor(book.status)} p-2 rounded-lg items-center justify-center w-[18%] h-14 m-1`}
      onPress={() => onViewChapters(book.id)}
    >
      <View className="absolute top-1 right-1">
        {renderStatusIcon(book.status)}
      </View>
      <Text
        className={`${getTextColor(book.status)} text-center font-medium text-xs`}
        numberOfLines={1}
      >
        {book.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-secondary-200">
      <View className="p-4">
        {/* All Bible Books */}
        <View className="mb-6">
          <View className="flex-row flex-wrap justify-center">
            {bibleBooks.map(renderBookTile)}
          </View>
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
      </View>
    </ScrollView>
  );
};

export default BibleBookProgress;
