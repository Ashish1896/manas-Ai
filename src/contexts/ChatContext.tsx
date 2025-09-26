import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  ChatState,
  ChatEvent,
  User,
  ChatRoom,
  Message,
  DiscussionGroup,
  MentorSession,
  MOCK_USERS,
} from "@/types/chat";

// Initial state
const initialState: ChatState = {
  currentUser: null,
  activeChatRoom: null,
  discussionGroups: [],
  mentorSessions: [],
  isConnected: false,
  isTyping: {},
};

// Action types
type ChatAction =
  | { type: "SET_CURRENT_USER"; payload: User }
  | { type: "SET_ACTIVE_CHAT_ROOM"; payload: ChatRoom | null }
  | { type: "ADD_MESSAGE"; payload: { roomId: string; message: Message } }
  | { type: "JOIN_DISCUSSION_GROUP"; payload: DiscussionGroup }
  | { type: "LEAVE_DISCUSSION_GROUP"; payload: string }
  | { type: "CREATE_MENTOR_SESSION"; payload: MentorSession }
  | { type: "UPDATE_MENTOR_SESSION"; payload: MentorSession }
  | {
      type: "UPDATE_TYPING";
      payload: { roomId: string; userId: string; isTyping: boolean };
    }
  | { type: "SET_CONNECTION_STATUS"; payload: boolean }
  | { type: "LOAD_DISCUSSION_GROUPS"; payload: DiscussionGroup[] }
  | {
      type: "UPDATE_USER_STATUS";
      payload: { userId: string; status: User["status"] };
    };

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };

    case "SET_ACTIVE_CHAT_ROOM":
      return { ...state, activeChatRoom: action.payload };

    case "ADD_MESSAGE":
      const { roomId, message } = action.payload;
      return {
        ...state,
        discussionGroups: state.discussionGroups.map((group) =>
          group.id === roomId
            ? {
                ...group,
                messages: [...group.messages, message],
                lastActivity: new Date(),
              }
            : group
        ),
        mentorSessions: state.mentorSessions.map((session) =>
          session.id === roomId
            ? {
                ...session,
                messages: [...session.messages, message],
                lastActivity: new Date(),
              }
            : session
        ),
        activeChatRoom:
          state.activeChatRoom?.id === roomId
            ? {
                ...state.activeChatRoom,
                messages: [...state.activeChatRoom.messages, message],
              }
            : state.activeChatRoom,
      };

    case "JOIN_DISCUSSION_GROUP":
      return {
        ...state,
        discussionGroups: [...state.discussionGroups, action.payload],
      };

    case "LEAVE_DISCUSSION_GROUP":
      return {
        ...state,
        discussionGroups: state.discussionGroups.filter(
          (group) => group.id !== action.payload
        ),
      };

    case "CREATE_MENTOR_SESSION":
      return {
        ...state,
        mentorSessions: [...state.mentorSessions, action.payload],
      };

    case "UPDATE_MENTOR_SESSION":
      return {
        ...state,
        mentorSessions: state.mentorSessions.map((session) =>
          session.id === action.payload.id ? action.payload : session
        ),
      };

    case "UPDATE_TYPING":
      const { roomId: typingRoomId, userId, isTyping } = action.payload;
      const currentTypers = state.isTyping[typingRoomId] || [];

      return {
        ...state,
        isTyping: {
          ...state.isTyping,
          [typingRoomId]: isTyping
            ? [...currentTypers.filter((id) => id !== userId), userId]
            : currentTypers.filter((id) => id !== userId),
        },
      };

    case "SET_CONNECTION_STATUS":
      return { ...state, isConnected: action.payload };

    case "LOAD_DISCUSSION_GROUPS":
      return { ...state, discussionGroups: action.payload };

    case "UPDATE_USER_STATUS":
      const { userId: statusUserId, status } = action.payload;
      return {
        ...state,
        discussionGroups: state.discussionGroups.map((group) => ({
          ...group,
          participants: group.participants.map((user) =>
            user.id === statusUserId ? { ...user, status } : user
          ),
        })),
        mentorSessions: state.mentorSessions.map((session) => ({
          ...session,
          participants: session.participants.map((user) =>
            user.id === statusUserId ? { ...user, status } : user
          ),
        })),
      };

    default:
      return state;
  }
}

// Context
const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (roomId: string, content: string) => void;
  sendImageMessage: (roomId: string, imageFile: File) => Promise<void>;
  joinDiscussionGroup: (groupId: string) => void;
  leaveDiscussionGroup: (groupId: string) => void;
  startTyping: (roomId: string) => void;
  stopTyping: (roomId: string) => void;
  setActiveRoom: (room: ChatRoom | null) => void;
  createMentorSession: (session: MentorSession) => void;
  updateMentorSession: (session: MentorSession) => void;
} | null>(null);

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Simulate WebSocket connection
  useEffect(() => {
    // Simulate connection
    setTimeout(() => {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: true });
    }, 1000);

    // Load initial discussion groups
    const mockGroups: DiscussionGroup[] = [
      {
        id: "group-1",
        name: "Managing Academic Stress",
        type: "group",
        topic: "Managing Academic Stress",
        description:
          "A safe space to discuss study-related anxiety and stress management techniques.",
        participants: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[4]],
        messages: [
          {
            id: "msg-1",
            senderId: MOCK_USERS[4].id,
            senderName: MOCK_USERS[4].name,
            senderAvatar: MOCK_USERS[4].avatar,
            content:
              "Welcome everyone! Let's start by sharing what brings you the most stress in your academic life.",
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            type: "text",
          },
          {
            id: "msg-2",
            senderId: MOCK_USERS[0].id,
            senderName: MOCK_USERS[0].name,
            senderAvatar: MOCK_USERS[0].avatar,
            content:
              "Hi everyone! For me, it's definitely exam preparation and time management.",
            timestamp: new Date(Date.now() - 3300000), // 55 minutes ago
            type: "text",
          },
        ],
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        lastActivity: new Date(Date.now() - 3300000),
        isActive: true,
        moderator: MOCK_USERS[4],
        moderatorId: MOCK_USERS[4].id,
        nextSession: new Date("2025-09-15T19:00"),
        tags: ["stress", "academic", "support"],
        isJoined: false,
        maxParticipants: 15,
      },
      {
        id: "group-2",
        name: "Mindfulness & Meditation",
        type: "group",
        topic: "Mindfulness & Meditation",
        description:
          "Learn and practice mindfulness together in this supportive group environment.",
        participants: [MOCK_USERS[1], MOCK_USERS[2]],
        messages: [],
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        lastActivity: new Date(Date.now() - 7200000), // 2 hours ago
        isActive: true,
        moderator: MOCK_USERS[4],
        moderatorId: MOCK_USERS[4].id,
        nextSession: new Date("2025-09-16T18:30"),
        tags: ["mindfulness", "meditation", "wellness"],
        isJoined: false,
        maxParticipants: 12,
      },
    ];

    dispatch({ type: "LOAD_DISCUSSION_GROUPS", payload: mockGroups });
  }, []);

  const sendMessage = (roomId: string, content: string) => {
    if (!state.currentUser) {
      console.log("No current user set, cannot send message");
      return;
    }

    const message: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId: state.currentUser.id,
      senderName: state.currentUser.name,
      senderAvatar: state.currentUser.avatar,
      content,
      timestamp: new Date(),
      type: "text",
    };

    console.log("Sending message:", message, "to room:", roomId);
    dispatch({ type: "ADD_MESSAGE", payload: { roomId, message } });
  };

  const sendImageMessage = async (
    roomId: string,
    imageFile: File
  ): Promise<void> => {
    if (!state.currentUser) {
      console.log("No current user set, cannot send image");
      return;
    }

    // Create a URL for the image (in a real app, you'd upload to a server)
    const imageUrl = URL.createObjectURL(imageFile);

    const message: Message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      senderId: state.currentUser.id,
      senderName: state.currentUser.name,
      senderAvatar: state.currentUser.avatar,
      content: `Shared an image: ${imageFile.name}`,
      timestamp: new Date(),
      type: "image",
      imageUrl,
      fileName: imageFile.name,
      fileSize: imageFile.size,
    };

    console.log("Sending image message:", message, "to room:", roomId);
    dispatch({ type: "ADD_MESSAGE", payload: { roomId, message } });
  };

  const joinDiscussionGroup = (groupId: string) => {
    if (!state.currentUser) return;

    const group = state.discussionGroups.find((g) => g.id === groupId);
    if (
      group &&
      !group.participants.find((p) => p.id === state.currentUser!.id)
    ) {
      const updatedGroup = {
        ...group,
        participants: [...group.participants, state.currentUser],
        isJoined: true,
      };

      dispatch({ type: "LEAVE_DISCUSSION_GROUP", payload: groupId });
      dispatch({ type: "JOIN_DISCUSSION_GROUP", payload: updatedGroup });

      // Add system message
      const systemMessage: Message = {
        id: `msg-${Date.now()}-join`,
        senderId: "system",
        senderName: "System",
        senderAvatar: "🤖",
        content: `${state.currentUser.name} joined the discussion`,
        timestamp: new Date(),
        type: "system",
      };

      dispatch({
        type: "ADD_MESSAGE",
        payload: { roomId: groupId, message: systemMessage },
      });
    }
  };

  const leaveDiscussionGroup = (groupId: string) => {
    dispatch({ type: "LEAVE_DISCUSSION_GROUP", payload: groupId });
  };

  const startTyping = (roomId: string) => {
    if (!state.currentUser) return;
    dispatch({
      type: "UPDATE_TYPING",
      payload: { roomId, userId: state.currentUser.id, isTyping: true },
    });
  };

  const stopTyping = (roomId: string) => {
    if (!state.currentUser) return;
    dispatch({
      type: "UPDATE_TYPING",
      payload: { roomId, userId: state.currentUser.id, isTyping: false },
    });
  };

  const setActiveRoom = (room: ChatRoom | null) => {
    dispatch({ type: "SET_ACTIVE_CHAT_ROOM", payload: room });
  };

  const createMentorSession = (session: MentorSession) => {
    console.log("Creating mentor session:", session);
    dispatch({ type: "CREATE_MENTOR_SESSION", payload: session });
  };

  const updateMentorSession = (session: MentorSession) => {
    console.log("Updating mentor session:", session);
    dispatch({ type: "UPDATE_MENTOR_SESSION", payload: session });
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        dispatch,
        sendMessage,
        sendImageMessage,
        joinDiscussionGroup,
        leaveDiscussionGroup,
        startTyping,
        stopTyping,
        setActiveRoom,
        createMentorSession,
        updateMentorSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook to use chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
