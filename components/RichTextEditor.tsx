import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Text,
} from "react-native";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Heading1,
  Heading2,
} from "lucide-react-native";
import { WebView } from "react-native-webview";

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
}

const RichTextEditor = ({
  value,
  onChangeText,
  placeholder = "Write your thoughts here...",
  minHeight = 200,
  maxHeight = 500,
}: RichTextEditorProps) => {
  // For web platform, we'll use a WebView with HTML editor
  if (Platform.OS === "web") {
    return (
      <WebRichTextEditor
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        minHeight={minHeight}
        maxHeight={maxHeight}
      />
    );
  }

  // For native platforms, we'll use markdown-style formatting
  return (
    <MarkdownRichTextEditor
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      minHeight={minHeight}
      maxHeight={maxHeight}
    />
  );
};

// Web-based rich text editor using HTML
const WebRichTextEditor = ({
  value,
  onChangeText,
  placeholder,
  minHeight,
  maxHeight,
}: RichTextEditorProps) => {
  const webViewRef = useRef<WebView>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // HTML content for the editor
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 8px;
          height: 100%;
          min-height: ${minHeight}px;
          max-height: ${maxHeight}px;
        }
        #editor {
          outline: none;
          width: 100%;
          height: 100%;
          min-height: ${minHeight - 16}px;
          overflow-y: auto;
        }
        blockquote {
          border-left: 3px solid #ccc;
          margin-left: 5px;
          padding-left: 10px;
          color: #666;
        }
        h1 { font-size: 1.5em; }
        h2 { font-size: 1.3em; }
      </style>
    </head>
    <body>
      <div id="editor" contenteditable="true" placeholder="${placeholder}"></div>
      <script>
        // Initialize editor with content
        const editor = document.getElementById('editor');
        editor.innerHTML = ${JSON.stringify(value || "")};
        
        // Send content changes to React Native
        editor.addEventListener('input', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'content',
            content: editor.innerHTML
          }));
        });
        
        // Handle selection changes
        document.addEventListener('selectionchange', function() {
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'selection',
              hasSelection: !selection.isCollapsed
            }));
          }
        });
        
        // Notify when editor is ready
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
      </script>
    </body>
    </html>
  `;

  // Handle messages from WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "content") {
        onChangeText(data.content);
      } else if (data.type === "selection") {
        // Update formatting states based on selection if needed
      } else if (data.type === "ready") {
        setEditorReady(true);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  // Execute formatting commands
  const applyFormat = (format: string) => {
    if (!editorReady || !webViewRef.current) return;

    let command = "";
    switch (format) {
      case "bold":
        command = 'document.execCommand("bold", false, null);';
        setIsBold((prev) => !prev);
        break;
      case "italic":
        command = 'document.execCommand("italic", false, null);';
        setIsItalic((prev) => !prev);
        break;
      case "underline":
        command = 'document.execCommand("underline", false, null);';
        setIsUnderline((prev) => !prev);
        break;
      case "h1":
        command = 'document.execCommand("formatBlock", false, "<h1>");';
        break;
      case "h2":
        command = 'document.execCommand("formatBlock", false, "<h2>");';
        break;
      case "quote":
        command = 'document.execCommand("formatBlock", false, "<blockquote>");';
        break;
      case "bullet":
        command = 'document.execCommand("insertUnorderedList", false, null);';
        break;
      case "number":
        command = 'document.execCommand("insertOrderedList", false, null);';
        break;
      case "alignLeft":
        command = 'document.execCommand("justifyLeft", false, null);';
        break;
      case "alignCenter":
        command = 'document.execCommand("justifyCenter", false, null);';
        break;
      case "alignRight":
        command = 'document.execCommand("justifyRight", false, null);';
        break;
    }

    webViewRef.current.injectJavaScript(command);
    // Focus back on the editor
    webViewRef.current.injectJavaScript(
      'document.getElementById("editor").focus();',
    );
    return true;
  };

  return (
    <View className="bg-white border border-gray-300 rounded-lg">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="p-1 border-b border-gray-200"
      >
        <TouchableOpacity
          onPress={() => applyFormat("bold")}
          className={`p-2 mx-1 rounded ${isBold ? "bg-gray-200" : ""}`}
        >
          <Bold size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("italic")}
          className={`p-2 mx-1 rounded ${isItalic ? "bg-gray-200" : ""}`}
        >
          <Italic size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("underline")}
          className={`p-2 mx-1 rounded ${isUnderline ? "bg-gray-200" : ""}`}
        >
          <Underline size={18} color="#4b5563" />
        </TouchableOpacity>
        <View className="h-6 w-px bg-gray-300 mx-1 self-center" />
        <TouchableOpacity
          onPress={() => applyFormat("h1")}
          className="p-2 mx-1 rounded"
        >
          <Heading1 size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("h2")}
          className="p-2 mx-1 rounded"
        >
          <Heading2 size={18} color="#4b5563" />
        </TouchableOpacity>
        <View className="h-6 w-px bg-gray-300 mx-1 self-center" />
        <TouchableOpacity
          onPress={() => applyFormat("bullet")}
          className="p-2 mx-1 rounded"
        >
          <List size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("number")}
          className="p-2 mx-1 rounded"
        >
          <ListOrdered size={18} color="#4b5563" />
        </TouchableOpacity>
        <View className="h-6 w-px bg-gray-300 mx-1 self-center" />
        <TouchableOpacity
          onPress={() => applyFormat("alignLeft")}
          className="p-2 mx-1 rounded"
        >
          <AlignLeft size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("alignCenter")}
          className="p-2 mx-1 rounded"
        >
          <AlignCenter size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("alignRight")}
          className="p-2 mx-1 rounded"
        >
          <AlignRight size={18} color="#4b5563" />
        </TouchableOpacity>
        <View className="h-6 w-px bg-gray-300 mx-1 self-center" />
        <TouchableOpacity
          onPress={() => applyFormat("quote")}
          className="p-2 mx-1 rounded"
        >
          <Quote size={18} color="#4b5563" />
        </TouchableOpacity>
      </ScrollView>

      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={{ height: minHeight, maxHeight: maxHeight }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={["*"]}
        scrollEnabled={false}
        hideKeyboardAccessoryView={true}
        keyboardDisplayRequiresUserAction={false}
      />
    </View>
  );
};

// Markdown-style rich text editor for native platforms
const MarkdownRichTextEditor = ({
  value,
  onChangeText,
  placeholder = "Write your thoughts here...",
  minHeight = 200,
  maxHeight = 500,
}: RichTextEditorProps) => {
  const inputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Handle formatting with markdown syntax
  const applyFormat = (format: string) => {
    let newText = value;
    const selectedText = value.substring(selection.start, selection.end);
    let prefix = "";
    let suffix = "";
    let newCursorPosition = selection.end;
    let placeholder = "";

    // If no text is selected, insert placeholder with formatting
    if (selection.start === selection.end) {
      switch (format) {
        case "bold":
          prefix = "**";
          suffix = "**";
          placeholder = "Bold text";
          break;
        case "italic":
          prefix = "_";
          suffix = "_";
          placeholder = "Italic text";
          break;
        case "underline":
          prefix = "__";
          suffix = "__";
          placeholder = "Underlined text";
          break;
        case "h1":
          prefix = "# ";
          placeholder = "Heading 1";
          break;
        case "h2":
          prefix = "## ";
          placeholder = "Heading 2";
          break;
        case "quote":
          prefix = "> ";
          placeholder = "Quote text";
          break;
        case "bullet":
          prefix = "• ";
          placeholder = "List item";
          break;
        case "number":
          prefix = "1. ";
          placeholder = "List item";
          break;
        default:
          placeholder = "Text";
      }

      newText =
        value.substring(0, selection.start) +
        prefix +
        placeholder +
        suffix +
        value.substring(selection.end);

      // Position cursor inside the formatting marks
      newCursorPosition = selection.start + prefix.length + placeholder.length;

      // For headings and lists, position cursor after the placeholder
      if (["h1", "h2", "quote", "bullet", "number"].includes(format)) {
        newCursorPosition =
          selection.start + prefix.length + placeholder.length;
      }
    } else {
      // Text is selected, apply formatting to selection
      switch (format) {
        case "bold":
          prefix = "**";
          suffix = "**";
          break;
        case "italic":
          prefix = "_";
          suffix = "_";
          break;
        case "underline":
          prefix = "__";
          suffix = "__";
          break;
        case "h1":
          // For headings, add a line break before if needed
          if (selection.start > 0 && value[selection.start - 1] !== "\n") {
            prefix = "\n# ";
          } else {
            prefix = "# ";
          }
          break;
        case "h2":
          if (selection.start > 0 && value[selection.start - 1] !== "\n") {
            prefix = "\n## ";
          } else {
            prefix = "## ";
          }
          break;
        case "quote":
          // For quotes, add a line break and '> ' prefix
          if (selection.start > 0 && value[selection.start - 1] !== "\n") {
            prefix = "\n> ";
          } else {
            prefix = "> ";
          }
          break;
        case "bullet":
          // For bullet lists, add a line break and '• ' prefix
          if (selection.start > 0 && value[selection.start - 1] !== "\n") {
            prefix = "\n• ";
          } else {
            prefix = "• ";
          }
          break;
        case "number":
          // For numbered lists, add a line break and '1. ' prefix
          if (selection.start > 0 && value[selection.start - 1] !== "\n") {
            prefix = "\n1. ";
          } else {
            prefix = "1. ";
          }
          break;
        case "alignLeft":
        case "alignCenter":
        case "alignRight":
          // Alignment not implemented in markdown
          break;
      }

      newText =
        value.substring(0, selection.start) +
        prefix +
        selectedText +
        suffix +
        value.substring(selection.end);

      newCursorPosition = selection.end + prefix.length + suffix.length;
    }

    onChangeText(newText);

    // Set cursor position after the formatting is applied
    setTimeout(() => {
      setSelection({ start: newCursorPosition, end: newCursorPosition });
    }, 100);
  };

  return (
    <View className="bg-white border border-gray-300 rounded-lg">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="p-1 border-b border-gray-200"
      >
        <TouchableOpacity
          onPress={() => applyFormat("bold")}
          className={`p-2 mx-1 rounded ${isBold ? "bg-gray-200" : ""}`}
        >
          <Bold size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("italic")}
          className={`p-2 mx-1 rounded ${isItalic ? "bg-gray-200" : ""}`}
        >
          <Italic size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("underline")}
          className={`p-2 mx-1 rounded ${isUnderline ? "bg-gray-200" : ""}`}
        >
          <Underline size={18} color="#4b5563" />
        </TouchableOpacity>
        <View className="h-6 w-px bg-gray-300 mx-1 self-center" />
        <TouchableOpacity
          onPress={() => applyFormat("h1")}
          className="p-2 mx-1 rounded"
        >
          <Heading1 size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("h2")}
          className="p-2 mx-1 rounded"
        >
          <Heading2 size={18} color="#4b5563" />
        </TouchableOpacity>
        <View className="h-6 w-px bg-gray-300 mx-1 self-center" />
        <TouchableOpacity
          onPress={() => applyFormat("bullet")}
          className="p-2 mx-1 rounded"
        >
          <List size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("number")}
          className="p-2 mx-1 rounded"
        >
          <ListOrdered size={18} color="#4b5563" />
        </TouchableOpacity>
        <View className="h-6 w-px bg-gray-300 mx-1 self-center" />
        <TouchableOpacity
          onPress={() => applyFormat("alignLeft")}
          className="p-2 mx-1 rounded"
        >
          <AlignLeft size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("alignCenter")}
          className="p-2 mx-1 rounded"
        >
          <AlignCenter size={18} color="#4b5563" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => applyFormat("alignRight")}
          className="p-2 mx-1 rounded"
        >
          <AlignRight size={18} color="#4b5563" />
        </TouchableOpacity>
        <View className="h-6 w-px bg-gray-300 mx-1 self-center" />
        <TouchableOpacity
          onPress={() => applyFormat("quote")}
          className="p-2 mx-1 rounded"
        >
          <Quote size={18} color="#4b5563" />
        </TouchableOpacity>
      </ScrollView>

      {/* The actual editable text input */}
      <TextInput
        ref={inputRef}
        className="p-3"
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{ minHeight, maxHeight }}
        textAlignVertical="top"
        onSelectionChange={(event) => {
          setSelection(event.nativeEvent.selection);
        }}
        selection={selection}
      />
    </View>
  );
};

export default RichTextEditor;
