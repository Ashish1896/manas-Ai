import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Circle,
  Video,
  Phone,
  MoreVertical,
  FileText,
  Calendar,
  Image as ImageIcon,
  UserCheck,
} from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useMentorAuth } from "@/contexts/MentorAuthContext";
import { Message, User, MentorSession } from "@/types/chat";
import { formatDistanceToNow, format } from "date-fns";
import MentorLogin from "@/components/MentorLogin";

interface MentorChatProps {
  student?: User;
  onBack: () => void;
  showMentorLogin?: boolean;
  onMentorLogin?: () => void;
}

const MentorChat: React.FC<MentorChatProps> = ({
  student,
  onBack,
  showMentorLogin,
  onMentorLogin,
}) => {
  const {
    state,
    sendMessage,
    sendImageMessage,
    startTyping,
    stopTyping,
    createMentorSession,
    updateMentorSession,
  } = useChat();
  const { auth } = useMentorAuth();
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [session, setSession] = useState<MentorSession | null>(null);
  const [showMentorLoginModal, setShowMentorLoginModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create or find existing session
  useEffect(() => {
    if (student && state.currentUser) {
      // Check if session already exists in global state
      const existingSession = state.mentorSessions.find((s) => {
        // Check if this session involves the current user and the student
        const participantIds = s.participants.map((p) => p.id);
        return (
          participantIds.includes(state.currentUser!.id) &&
          participantIds.includes(student.id)
        );
      });

      if (existingSession) {
        console.log("Found existing session:", existingSession);
        setSession(existingSession);
      } else {
        // Create new session - determine who is mentor and who is student
        const mentor = auth.mentor || state.currentUser; // Use authenticated mentor or current user
        const sessionStudent = student;

        const newSession: MentorSession = {
          id: `session-${mentor.id}-${sessionStudent.id}-${Date.now()}`,
          name: `${mentor.name} & ${sessionStudent.name}`,
          type: "mentor-student",
          participants: [mentor, sessionStudent],
          messages: [
            {
              id: `welcome-${Date.now()}`,
              senderId: "system",
              senderName: "System",
              senderAvatar: "🤖",
              content: `Chat session started between ${mentor.name} and ${sessionStudent.name}`,
              timestamp: new Date(),
              type: "system",
            },
          ],
          createdAt: new Date(),
          lastActivity: new Date(),
          isActive: true,
          mentor: mentor,
          student: sessionStudent,
          status: "active",
        };

        console.log("Creating new session:", newSession);
        createMentorSession(newSession);
        setSession(newSession);
      }
    }
  }, [
    student,
    state.currentUser,
    state.mentorSessions,
    auth.mentor,
    createMentorSession,
  ]);

  // Update session in global state when local session changes
  useEffect(() => {
    if (session && session.messages.length > 1) {
      // Only update if there are actual messages (not just system message)
      updateMentorSession(session);
    }
  }, [session, updateMentorSession]);

  // Sync session from global state
  useEffect(() => {
    if (session) {
      const globalSession = state.mentorSessions.find(
        (s) => s.id === session.id
      );
      if (
        globalSession &&
        globalSession.messages.length !== session.messages.length
      ) {
        console.log("Syncing session from global state:", globalSession);
        setSession(globalSession);
      }
    }
  }, [state.mentorSessions, session]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const handleSendMessage = () => {
    if (messageText.trim() && session && state.currentUser) {
      console.log(
        "Mentor sending message:",
        messageText,
        "from user:",
        state.currentUser.name
      );
      sendMessage(session.id, messageText.trim());
      setMessageText("");
      handleStopTyping();
    } else {
      console.log("Cannot send mentor message - no text, session, or user:", {
        messageText,
        session,
        currentUser: state.currentUser,
      });
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && session && state.currentUser) {
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

      console.log("Mentor uploading image:", file.name);
      await sendImageMessage(session.id, file);
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

    if (!isTyping && e.target.value.length > 0 && session) {
      setIsTyping(true);
      startTyping(session.id);
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
    if (isTyping && session) {
      setIsTyping(false);
      stopTyping(session.id);
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
        <div key={message.id} className="flex justify-center my-4">
          <div className="bg-blue-50 text-blue-700 text-xs px-4 py-2 rounded-full border border-blue-200">
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
            className={`px-4 py-3 rounded-2xl ${
              isOwnMessage
                ? "bg-teal-600 text-white rounded-br-md"
                : "bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm"
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
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{message.content}</p>
            )}
            {isOwnMessage && (
              <div className="text-right mt-1">
                <span className="text-xs text-teal-100">
                  {format(message.timestamp, "HH:mm")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Show mentor login modal if requested
  if (showMentorLoginModal) {
    return (
      <div className="h-full relative">
        <MentorLogin
          onLoginSuccess={() => {
            setShowMentorLoginModal(false);
            if (onMentorLogin) onMentorLogin();
          }}
        />
        <Button
          onClick={() => setShowMentorLoginModal(false)}
          variant="ghost"
          className="absolute top-4 right-4 z-10"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (!session || !student) {
    return (
      <div className="h-full flex items-center justify-center bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-gray-600">Select a student to start chatting</p>
          {!state.currentUser && (
            <p className="text-red-500 text-sm mt-2">Please log in to chat</p>
          )}
        </div>
      </div>
    );
  }

  const typingUsers = session
    ? state.isTyping[session.id]?.filter(
        (userId) => userId !== state.currentUser?.id
      ) || []
    : [];

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
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className="text-2xl">{student.avatar}</span>
                <Circle
                  className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                    student.status === "online"
                      ? "bg-green-400"
                      : student.status === "away"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                  }`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>
                    {student.status === "online"
                      ? "Online"
                      : student.status === "away"
                      ? "Away"
                      : `Last seen ${formatDistanceToNow(student.lastActive, {
                          addSuffix: true,
                        })}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Small Mentor Login Button */}
            {!auth.isAuthenticated && (
              <Button
                onClick={() => setShowMentorLoginModal(true)}
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3 py-1 h-7"
                title="Login as mentor to reply"
              >
                <UserCheck className="w-3 h-3 mr-1" />
                Mentor
              </Button>
            )}
            <Badge variant="secondary" className="text-xs">
              {auth.isAuthenticated ? "Mentor Session" : "Chat with Mentor"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-600 hover:text-green-700"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-gradient-to-b from-teal-50/20 to-blue-50/20">
        {session.messages.length <= 1 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {auth.isAuthenticated
                ? `Mentor Session with ${student.name}`
                : `Chat with ${student.name}`}
            </h4>
            <p className="text-gray-600 max-w-sm mb-4">
              {auth.isAuthenticated
                ? "This is a private conversation between you and your assigned student. Everything discussed here is confidential."
                : "Start a conversation with the mentor. Messages are confidential and secure."}
            </p>
            {!auth.isAuthenticated && (
              <Button
                onClick={() => setShowMentorLoginModal(true)}
                variant="outline"
                className="mb-4"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Login as Mentor to Reply
              </Button>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>Session Notes Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Started {format(session.createdAt, "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {session.messages.map(renderMessage)}
            {typingUsers.length > 0 && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span className="text-lg">{student.avatar}</span>
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
                  <span>{student.name} is typing...</span>
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
            placeholder={`Send a message to ${student.name}...`}
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
            Please log in to send messages
          </p>
        ) : auth.isAuthenticated ? (
          <p className="text-xs text-gray-500 mt-2">
            Professional mentor session - Click image icon to share pictures, or
            press Enter to send
          </p>
        ) : (
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">
              Chat as student - Click image icon to share pictures, or press
              Enter to send
            </p>
            <Button
              onClick={() => setShowMentorLoginModal(true)}
              variant="ghost"
              size="sm"
              className="text-xs text-teal-600 hover:text-teal-700 p-1 h-auto"
            >
              Login as Mentor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorChat;
