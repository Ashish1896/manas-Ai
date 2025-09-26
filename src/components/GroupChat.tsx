import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Users,
  MoreVertical,
  Circle,
  Clock,
  Calendar,
  Hash,
  Paperclip,
  Image as ImageIcon,
} from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { DiscussionGroup, Message, User } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";

interface GroupChatProps {
  group: DiscussionGroup;
  onBack: () => void;
}

const GroupChat: React.FC<GroupChatProps> = ({ group, onBack }) => {
  const { state, sendMessage, sendImageMessage, startTyping, stopTyping } =
    useChat();
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [group.messages]);

  const handleSendMessage = () => {
    if (messageText.trim() && state.currentUser) {
      console.log(
        "Attempting to send message:",
        messageText,
        "from user:",
        state.currentUser.name
      );
      sendMessage(group.id, messageText.trim());
      setMessageText("");
      handleStopTyping();
    } else {
      console.log("Cannot send message - no text or no user:", {
        messageText,
        currentUser: state.currentUser,
      });
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && state.currentUser) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      console.log("Uploading image:", file.name);
      await sendImageMessage(group.id, file);
    }

    // Reset file input
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      startTyping(group.id);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1500);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      stopTyping(group.id);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.senderId === state.currentUser?.id;
    const isSystemMessage = message.type === "system";
    const isImageMessage = message.type === "image";

    if (isSystemMessage) {
      return (
        <div key={message.id} className="flex justify-center my-2">
          <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div
        key={message.id}
        className={`flex ${
          isOwnMessage ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md ${
            isOwnMessage ? "order-1" : "order-2"
          }`}
        >
          {!isOwnMessage && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-lg">{message.senderAvatar}</span>
              <span className="text-sm font-medium text-gray-700">
                {message.senderName}
              </span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
              </span>
            </div>
          )}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? "bg-teal-600 text-white rounded-br-md"
                : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
            }`}
          >
            {isImageMessage && message.imageUrl ? (
              <div className="space-y-2">
                <img
                  src={message.imageUrl}
                  alt={message.fileName || "Shared image"}
                  className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.imageUrl, "_blank")}
                  style={{ maxHeight: "200px" }}
                />
                <p className="text-sm">{message.content}</p>
              </div>
            ) : (
              <p className="text-sm">{message.content}</p>
            )}
            {isOwnMessage && (
              <div className="text-right mt-1">
                <span className="text-xs text-teal-100">
                  {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const typingUsers =
    state.isTyping[group.id]?.filter(
      (userId) => userId !== state.currentUser?.id
    ) || [];
  const typingUserNames = typingUsers.map((userId) => {
    const user = group.participants.find((p) => p.id === userId);
    return user?.name || "Someone";
  });

  return (
    <div className="h-full flex flex-col bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Hash className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-3 h-3" />
                  <span>{group.participants.length} members</span>
                  <Circle className="w-1 h-1 fill-current" />
                  <span>Moderated by {group.moderator.name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {group.nextSession && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Next: {new Date(group.nextSession).toLocaleDateString()}
              </Badge>
            )}
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-b from-blue-50/20 to-teal-50/20">
        {group.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-4">💬</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to {group.name}!
            </h4>
            <p className="text-gray-600 max-w-sm">{group.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Start the conversation by sending the first message.
            </p>
          </div>
        ) : (
          <>
            {group.messages.map(renderMessage)}
            {typingUserNames.length > 0 && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span>
                    {typingUserNames.length === 1
                      ? `${typingUserNames[0]} is typing...`
                      : `${typingUserNames
                          .slice(0, -1)
                          .join(", ")} and ${typingUserNames.slice(
                          -1
                        )} are typing...`}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white/50">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={!state.currentUser}
              className="p-2 hover:bg-gray-100"
              title="Upload image"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <Input
            value={messageText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${group.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="flex-1 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
            disabled={!state.currentUser}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !state.currentUser}
            className="bg-teal-600 hover:bg-teal-700 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!state.currentUser ? (
          <p className="text-xs text-gray-500 mt-2">
            Please join the discussion to send messages
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-2">
            Tip: Click the image icon to share pictures, or press Enter to send
          </p>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
