import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Users,
  MessageCircle,
  Heart,
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Circle,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ChatProvider, useChat } from "@/contexts/ChatContext";
import {
  MentorAuthProvider,
  useMentorAuth,
} from "@/contexts/MentorAuthContext";
import { User, DiscussionGroup } from "@/types/chat";
import MentorLogin from "@/components/MentorLogin";
import GroupChat from "@/components/GroupChat";
import MentorChat from "@/components/MentorChat";
// Import the animation as a URL
const consultationAnimationUrl =
  "/animation/wired-flat-981-consultation-hover-conversation.json";

const CommunityContent: React.FC = () => {
  const { t } = useTranslation();
  const { state, dispatch, joinDiscussionGroup, setActiveRoom } = useChat();
  const { auth, logout } = useMentorAuth();
  const [activeTab, setActiveTab] = useState<"chat" | "events">("chat");
  const [chatSubTab, setChatSubTab] = useState("mentor");
  const [selectedGroup, setSelectedGroup] = useState<DiscussionGroup | null>(
    null
  );
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "chat">("list");
  const [showMentorLogin, setShowMentorLogin] = useState(false);

  // Set current user based on auth state
  useEffect(() => {
    if (auth.isAuthenticated && auth.mentor && !state.currentUser) {
      // Set mentor as current user when authenticated
      dispatch({ type: "SET_CURRENT_USER", payload: auth.mentor });
    } else if (!auth.isAuthenticated && !state.currentUser) {
      // Set a guest user for normal users (not mentors)
      const guestUser: User = {
        id: `guest-${Date.now()}`,
        name: "Student User",
        avatar: "👤",
        status: "online",
        lastActive: new Date(),
        role: "student",
      };
      dispatch({ type: "SET_CURRENT_USER", payload: guestUser });
    }
  }, [auth, state.currentUser, dispatch]);

  const handleJoinGroup = (group: DiscussionGroup) => {
    joinDiscussionGroup(group.id);
    setSelectedGroup(group);
    setActiveRoom(group);
    setViewMode("chat");
  };

  const handleSelectStudent = (student: User) => {
    setSelectedStudent(student);
    setViewMode("chat");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedGroup(null);
    setSelectedStudent(null);
    setActiveRoom(null);
  };

  const handleMentorLogout = () => {
    logout();
    setViewMode("list");
    setSelectedStudent(null);
  };

  const mentor = {
    id: 1,
    name: "Arjun Patel",
    avatar: "👨‍🎓",
    status: "online",
    bio: "Final year psychology student with training in peer counseling. Here to listen and support.",
    lastActive: "now",
    badge: "Certified Peer Counselor",
    totalSessions: 45,
    rating: 4.8,
  };

  const events = [
    {
      id: 1,
      title: "Art Therapy Workshop",
      category: "Art",
      host: "Creative Wellness Team",
      date: "2025-09-20T16:00",
      duration: "2 hours",
      location: "Online",
      participants: 8,
      maxParticipants: 15,
      description:
        "Express yourself through colors and creative art in a supportive environment.",
      image: "🎨",
    },
    {
      id: 2,
      title: "Music Therapy Session",
      category: "Music",
      host: "Sound Healing Collective",
      date: "2025-09-22T18:00",
      duration: "1.5 hours",
      location: "Online",
      participants: 12,
      maxParticipants: 20,
      description:
        "Experience the healing power of music and sound in this group session.",
      image: "🎵",
    },
    {
      id: 3,
      title: "Nature Photography Walk",
      category: "Photography",
      host: "Outdoor Wellness Group",
      date: "2025-09-25T09:00",
      duration: "3 hours",
      location: "Lodhi Gardens, Delhi",
      participants: 5,
      maxParticipants: 12,
      description:
        "Connect with nature and practice mindfulness through photography.",
      image: "📸",
    },
    {
      id: 4,
      title: "Reading Circle: Mental Wellness",
      category: "Reading",
      host: "Book Club Wellness",
      date: "2025-09-28T19:00",
      duration: "1 hour",
      location: "Online",
      participants: 7,
      maxParticipants: 10,
      description:
        "Discuss inspiring books about mental health and personal growth.",
      image: "📚",
    },
  ];

  // Show mentor login modal
  if (showMentorLogin) {
    return <MentorLogin onLoginSuccess={() => setShowMentorLogin(false)} />;
  }

  return (
    <div className="min-h-screen pt-20 pb-8 bg-gradient-calm">
      <div className="container mx-auto px-6 max-w-6xl py-6 pb-24 lg:pb-6">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-4">{t("community.title")}</h1>
        </div>

        {/* Main Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "chat"
                ? "bg-teal-600 text-white"
                : "bg-white/70 text-gray-700 hover:bg-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle size={18} />
              <span>{t("community.tabs.chat")}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "events"
                ? "bg-teal-600 text-white"
                : "bg-white/70 text-gray-700 hover:bg-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>{t("community.tabs.events")}</span>
            </div>
          </button>
        </div>

        {activeTab === "chat" && (
          <div>
            {/* Chat Sub-tabs */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setChatSubTab("mentor")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  chatSubTab === "mentor"
                    ? "bg-blue-600 text-white"
                    : "bg-white/70 text-gray-700 hover:bg-white"
                }`}
              >
                {t("community.chat.mentor")}
              </button>
              <button
                onClick={() => setChatSubTab("discussion")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  chatSubTab === "discussion"
                    ? "bg-blue-600 text-white"
                    : "bg-white/70 text-gray-700 hover:bg-white"
                }`}
              >
                Open Discussion
              </button>
            </div>

            {chatSubTab === "mentor" && (
              <div>
                {viewMode === "chat" && selectedStudent ? (
                  <div className="h-[600px]">
                    <MentorChat
                      student={selectedStudent}
                      onBack={handleBackToList}
                    />
                  </div>
                ) : !auth.isAuthenticated ? (
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Mentor Profile - Static for students */}
                    <div className="lg:col-span-1">
                      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6">
                        <div className="text-center mb-6">
                          <div className="text-6xl mb-3">{mentor.avatar}</div>
                          <div className="relative inline-block">
                            <h3 className="text-xl font-bold text-gray-900">
                              {mentor.name}
                            </h3>
                            <div
                              className={`absolute -top-1 -right-8 w-3 h-3 rounded-full ${
                                mentor.status === "online"
                                  ? "bg-green-400"
                                  : "bg-gray-400"
                              }`}
                            ></div>
                          </div>
                          <div className="flex items-center justify-center space-x-2 mt-2">
                            <UserCheck size={16} className="text-teal-600" />
                            <span className="text-sm text-teal-600 font-medium">
                              {mentor.badge}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {mentor.bio}
                            </p>
                          </div>

                          <div className="flex justify-between text-center">
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {mentor.totalSessions}
                              </p>
                              <p className="text-xs text-gray-600">
                                {t("community.chat.mentorProfile.sessions")}
                              </p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {mentor.rating}
                              </p>
                              <p className="text-xs text-gray-600">
                                {t("community.chat.mentorProfile.rating")}
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-600">
                              {t("community.chat.mentorProfile.lastActive")}{" "}
                              {mentor.lastActive}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chat Window - Allow normal users to chat with mentor */}
                    <div className="lg:col-span-2">
                      <div className="h-[600px]">
                        <MentorChat
                          student={{
                            id: mentor.id.toString(),
                            name: mentor.name,
                            avatar: mentor.avatar,
                            status: mentor.status as
                              | "online"
                              | "away"
                              | "offline",
                            lastActive: new Date(),
                            role: "mentor",
                          }}
                          onBack={() => {}}
                          showMentorLogin={showMentorLogin}
                          onMentorLogin={() => {
                            setShowMentorLogin(false);
                            // The auth context will handle the state update automatically
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mentor Dashboard - Show different views based on authentication */
                  <div className="space-y-6">
                    {/* Mentor login option for authenticated mentors */}
                    <div className="flex items-center justify-between bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">
                          {auth.mentor?.avatar || "👨‍🎓"}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {auth.mentor
                              ? `Welcome, ${auth.mentor.name}`
                              : "Mentor Access"}
                          </h3>
                          <p className="text-gray-600">
                            {auth.mentor
                              ? `You have ${auth.assignedStudents.length} assigned students`
                              : "Login as a mentor to access student chat dashboard"}
                          </p>
                        </div>
                      </div>
                      {auth.mentor ? (
                        <Button
                          onClick={handleMentorLogout}
                          variant="outline"
                          className="flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setShowMentorLogin(true)}
                          className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          Mentor Login
                        </Button>
                      )}
                    </div>

                    {/* Show student cards for authenticated mentors only */}
                    {auth.mentor && (
                      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {auth.assignedStudents.map((student) => (
                          <div
                            key={student.id}
                            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6"
                          >
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="relative">
                                <span className="text-3xl">
                                  {student.avatar}
                                </span>
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
                                <h4 className="font-semibold text-gray-900">
                                  {student.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {student.status === "online"
                                    ? "Online now"
                                    : student.status === "away"
                                    ? "Away"
                                    : "Offline"}
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleSelectStudent(student)}
                              className="w-full bg-teal-600 hover:bg-teal-700"
                            >
                              Start Chat
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {chatSubTab === "discussion" &&
              (viewMode === "chat" && selectedGroup ? (
                <div className="h-[600px]">
                  <GroupChat group={selectedGroup} onBack={handleBackToList} />
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {state.discussionGroups.map((group) => (
                    <div
                      key={group.id}
                      className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center mb-2">
                          <div className="mr-3">
                            <DotLottieReact
                              src={consultationAnimationUrl}
                              loop
                              autoplay
                              style={{ width: "32px", height: "32px" }}
                            />
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {group.topic}
                          </h3>
                        </div>
                        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                          {group.description}
                        </p>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {t("community.chat.discussion.activeMembers")}
                            </span>
                            <span className="font-medium text-gray-900">
                              {group.participants.length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {t("community.chat.discussion.moderator")}
                            </span>
                            <span className="font-medium text-gray-900">
                              {group.moderator.name}
                            </span>
                          </div>
                          {group.nextSession && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {t("community.chat.discussion.nextSession")}
                              </span>
                              <span className="font-medium text-gray-900">
                                {new Date(group.nextSession).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Circle className="w-2 h-2 bg-green-400 rounded-full" />
                            <span className="text-sm text-gray-600">
                              {group.participants.length} members active
                            </span>
                          </div>
                          {group.isJoined && (
                            <Badge variant="secondary" className="text-xs">
                              Joined
                            </Badge>
                          )}
                        </div>

                        <Button
                          onClick={() => handleJoinGroup(group)}
                          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                          {group.isJoined
                            ? "Enter Discussion"
                            : t("community.chat.discussion.joinGroup")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{event.image}</div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center space-x-3">
                      <Clock size={16} className="text-gray-500" />
                      <div className="text-sm">
                        <span className="text-gray-600">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-gray-500 ml-2">
                          ({event.duration})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {event.participants}/{event.maxParticipants}{" "}
                        {t("community.events.participants")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      {t("community.events.hostedBy")}{" "}
                      <span className="font-medium text-gray-900">
                        {event.host}
                      </span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-400 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            (event.participants / event.maxParticipants) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium">
                    {t("community.events.signUp")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main wrapper component with providers
const PeerToPeer: React.FC = () => {
  return (
    <MentorAuthProvider>
      <ChatProvider>
        <CommunityContent />
      </ChatProvider>
    </MentorAuthProvider>
  );
};

export default PeerToPeer;
