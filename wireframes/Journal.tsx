import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  BookText,
  Search,
  Tag,
  Folder,
  Filter,
  X,
  ChevronLeft,
  Save,
  HelpCircle,
  Plus,
} from "lucide-react-native";

export default function JournalWireframe() {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Journal List View */}
      <View className="flex-1 bg-gray-100" style={{ display: "none" }}>
        <View className="px-4 py-3 bg-white border-b border-gray-300">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center bg-gray-100 rounded-full px-3 py-2 flex-1 mr-2">
              <Search size={18} color="#7E57C2" />
              <TextInput
                className="flex-1 ml-2 text-gray-700"
                placeholder="Search journal entries..."
              />
            </View>
            <TouchableOpacity className="p-2 bg-indigo-50 rounded-full">
              <Filter size={20} color="#7E57C2" />
            </TouchableOpacity>
          </View>

          <View className="mb-2">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-medium text-gray-700">Filter by:</Text>
              <TouchableOpacity>
                <Text className="text-indigo-600 text-sm">Clear filters</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-gray-600 mb-1">Folders:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              <TouchableOpacity
                style={{ backgroundColor: "#4f46e5" }}
                className="rounded-full px-3 py-1 mr-2 flex-row items-center"
              >
                <Folder size={14} color="#ffffff" />
                <Text className="ml-1 text-sm text-white">Spiritual Gems</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "#10b98120" }}
                className="rounded-full px-3 py-1 mr-2 flex-row items-center"
              >
                <Folder size={14} color="#10b981" />
                <Text className="ml-1 text-sm" style={{ color: "#10b981" }}>
                  Meeting Notes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "#f59e0b20" }}
                className="rounded-full px-3 py-1 mr-2 flex-row items-center"
              >
                <Folder size={14} color="#f59e0b" />
                <Text className="ml-1 text-sm" style={{ color: "#f59e0b" }}>
                  Ministry Experiences
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200">
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center">
                <Calendar size={16} color="#7E57C2" />
                <Text className="text-gray-500 text-xs ml-1">Jun 15, 2023</Text>
              </View>
              <View
                style={{ backgroundColor: "#4f46e520" }}
                className="rounded-full px-2 py-0.5 flex-row items-center"
              >
                <Folder size={12} color="#4f46e5" />
                <Text style={{ color: "#4f46e5" }} className="text-xs ml-1">
                  Spiritual Gems
                </Text>
              </View>
              <ChevronRight size={18} color="#7E57C2" />
            </View>

            <Text className="text-lg font-semibold mt-2 text-gray-800">
              Insights from Matthew 5
            </Text>
            <Text className="text-gray-600 mt-1 text-sm" numberOfLines={2}>
              Today I was reading the Sermon on the Mount and was struck by
              Jesus' words about being the light of the world...
            </Text>

            <View className="flex-row mt-3 flex-wrap">
              <View className="bg-indigo-50 rounded-full px-3 py-1 mr-2 mb-1 flex-row items-center">
                <Tag size={12} color="#7E57C2" />
                <Text className="text-indigo-700 text-xs ml-1">
                  Matthew 5:14-16
                </Text>
              </View>
              <View className="bg-indigo-50 rounded-full px-3 py-1 mr-2 mb-1 flex-row items-center">
                <Tag size={12} color="#7E57C2" />
                <Text className="text-indigo-700 text-xs ml-1">
                  Light of the world
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200">
            <View className="flex-row justify-between items-start">
              <View className="flex-row items-center">
                <Calendar size={16} color="#7E57C2" />
                <Text className="text-gray-500 text-xs ml-1">Jun 10, 2023</Text>
              </View>
              <View
                style={{ backgroundColor: "#10b98120" }}
                className="rounded-full px-2 py-0.5 flex-row items-center"
              >
                <Folder size={12} color="#10b981" />
                <Text style={{ color: "#10b981" }} className="text-xs ml-1">
                  Meeting Notes
                </Text>
              </View>
              <ChevronRight size={18} color="#7E57C2" />
            </View>

            <Text className="text-lg font-semibold mt-2 text-gray-800">
              Midweek Meeting Notes
            </Text>
            <Text className="text-gray-600 mt-1 text-sm" numberOfLines={2}>
              The talk on maintaining spiritual focus was very encouraging. The
              speaker emphasized the importance of...
            </Text>

            <View className="flex-row mt-3 flex-wrap">
              <View className="bg-indigo-50 rounded-full px-3 py-1 mr-2 mb-1 flex-row items-center">
                <Tag size={12} color="#7E57C2" />
                <Text className="text-indigo-700 text-xs ml-1">
                  Philippians 4:8
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Floating action button */}
          <TouchableOpacity className="absolute bottom-6 right-6 bg-indigo-600 w-14 h-14 rounded-full items-center justify-center shadow-lg">
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Journal Entry View */}
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1 p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity className="p-2">
              <ChevronLeft size={24} color="#333" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-center flex-1">
              New Journal Entry
            </Text>
            <TouchableOpacity className="p-2">
              <Save size={24} color="#4f46e5" />
            </TouchableOpacity>
          </View>

          {/* Date display */}
          <Text className="text-sm text-gray-500 mb-4">
            Thursday, June 15, 2023
          </Text>

          {/* Folder selector */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1 text-gray-700">
              Folder
            </Text>
            <TouchableOpacity className="flex-row items-center justify-between border border-gray-300 rounded-lg p-3 bg-white">
              <View className="flex-row items-center">
                <View
                  style={{ backgroundColor: "#4f46e5" }}
                  className="w-6 h-6 rounded-md items-center justify-center mr-2"
                >
                  <Folder size={14} color="#ffffff" />
                </View>
                <Text className="text-gray-800">Spiritual Gems</Text>
              </View>
              <ChevronDown size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Title input */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1 text-gray-700">
              Title
            </Text>
            <TextInput
              className="text-xl font-semibold border border-gray-300 rounded-lg p-3 bg-white"
              placeholder="Entry Title"
              value="Insights from Matthew 5"
            />
          </View>

          {/* Scripture Tags */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Scripture References
            </Text>

            <View className="flex-row flex-wrap mb-2">
              <View className="flex-row items-center bg-indigo-50 rounded-full px-3 py-1 mr-2 mb-2">
                <Tag size={14} color="#4f46e5" />
                <Text className="mx-1 text-indigo-700">Matthew 5:14-16</Text>
                <TouchableOpacity>
                  <X size={14} color="#4f46e5" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="flex-row items-center bg-gray-100 rounded-full px-3 py-1 mb-2">
                <Plus size={14} color="#4b5563" />
                <Text className="ml-1 text-gray-600">Add Tag</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Rich Text Editor */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm font-medium text-gray-700">
                Journal Content
              </Text>
              <TouchableOpacity className="p-1">
                <HelpCircle size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View className="bg-white border border-gray-300 rounded-lg">
              <View className="p-1 border-b border-gray-200 flex-row">
                <TouchableOpacity className="p-2 mx-1 rounded">
                  <B size={18} color="#4b5563" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 mx-1 rounded">
                  <I size={18} color="#4b5563" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 mx-1 rounded">
                  <U size={18} color="#4b5563" />
                </TouchableOpacity>
                <View className="h-6 w-px bg-gray-300 mx-1 self-center" />
                <TouchableOpacity className="p-2 mx-1 rounded">
                  <H1 size={18} color="#4b5563" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2 mx-1 rounded">
                  <H2 size={18} color="#4b5563" />
                </TouchableOpacity>
              </View>
              <TextInput
                className="p-3"
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                placeholder="Write your spiritual reflection here..."
                value="Today I was reading the Sermon on the Mount and was struck by Jesus' words about being the light of the world. He said that we are the light of the world and that we should let our light shine before others. This made me think about how I can be a better witness in my daily life."
              />
            </View>
          </View>

          {/* Spiritual prompts */}
          <View className="mb-6 bg-indigo-50 p-4 rounded-lg">
            <Text className="font-medium mb-2 text-indigo-800">
              Reflection Prompts:
            </Text>
            <TouchableOpacity className="mb-2">
              <Text className="text-indigo-700">
                • How did this scripture strengthen my faith?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="mb-2">
              <Text className="text-indigo-700">
                • What practical lessons can I apply?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-indigo-700">
                • How can I share this insight with others?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function Calendar(props) {
  return <View {...props} />;
}

function ChevronRight(props) {
  return <View {...props} />;
}

function B(props) {
  return <View {...props} />;
}

function I(props) {
  return <View {...props} />;
}

function U(props) {
  return <View {...props} />;
}

function H1(props) {
  return <View {...props} />;
}

function H2(props) {
  return <View {...props} />;
}
