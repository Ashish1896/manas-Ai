import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  MentorCredentials,
  MentorAuth,
  TEST_MENTOR_CREDENTIALS,
  MOCK_USERS,
} from "@/types/chat";

// Initial auth state
const initialAuthState: MentorAuth = {
  isAuthenticated: false,
  mentor: null,
  assignedStudents: [],
};

// Context
const MentorAuthContext = createContext<{
  auth: MentorAuth;
  login: (credentials: MentorCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
} | null>(null);

// Provider component
export const MentorAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<MentorAuth>(initialAuthState);
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("mentorAuth");
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        console.error("Error parsing saved auth:", error);
        localStorage.removeItem("mentorAuth");
      }
    }
  }, []);

  const login = async (credentials: MentorCredentials): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials against test credentials
      if (
        credentials.email === TEST_MENTOR_CREDENTIALS.email &&
        credentials.password === TEST_MENTOR_CREDENTIALS.password
      ) {
        const mentorUser = MOCK_USERS.find((user) => user.role === "mentor");
        if (!mentorUser) {
          throw new Error("Mentor user not found");
        }

        // Mock assigned students (all student users)
        const assignedStudents = MOCK_USERS.filter(
          (user) => user.role === "student"
        );

        const authState: MentorAuth = {
          isAuthenticated: true,
          mentor: mentorUser,
          assignedStudents,
        };

        setAuth(authState);
        localStorage.setItem("mentorAuth", JSON.stringify(authState));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuth(initialAuthState);
    localStorage.removeItem("mentorAuth");
  };

  return (
    <MentorAuthContext.Provider
      value={{
        auth,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </MentorAuthContext.Provider>
  );
};

// Hook to use mentor auth context
export const useMentorAuth = () => {
  const context = useContext(MentorAuthContext);
  if (!context) {
    throw new Error("useMentorAuth must be used within a MentorAuthProvider");
  }
  return context;
};
