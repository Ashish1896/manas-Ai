import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react";
import { useMentorAuth } from "@/contexts/MentorAuthContext";
import { MentorCredentials, TEST_MENTOR_CREDENTIALS } from "@/types/chat";

interface MentorLoginProps {
  onLoginSuccess: () => void;
}

const MentorLogin: React.FC<MentorLoginProps> = ({ onLoginSuccess }) => {
  const { login, isLoading } = useMentorAuth();
  const [credentials, setCredentials] = useState<MentorCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password");
      return;
    }

    const success = await login(credentials);
    if (success) {
      onLoginSuccess();
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const fillTestCredentials = () => {
    setCredentials(TEST_MENTOR_CREDENTIALS);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-calm p-4">
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg shadow-xl border border-white/50">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">👨‍🎓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Mentor Login
          </h2>
          <p className="text-gray-600">
            Sign in to access your mentor dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter your email"
                className="pl-10 h-12"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Enter your password"
                className="pl-10 pr-10 h-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center space-y-3">
            <button
              onClick={() => setShowTestCredentials(!showTestCredentials)}
              className="text-sm text-teal-600 hover:text-teal-700 underline"
            >
              {showTestCredentials ? "Hide" : "Show"} Test Credentials
            </button>

            {showTestCredentials && (
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Test Credentials:
                </p>
                <p className="text-sm text-blue-800">
                  Email: {TEST_MENTOR_CREDENTIALS.email}
                </p>
                <p className="text-sm text-blue-800">
                  Password: {TEST_MENTOR_CREDENTIALS.password}
                </p>
                <Button
                  type="button"
                  onClick={fillTestCredentials}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-sm"
                  size="sm"
                  disabled={isLoading}
                >
                  Use Test Credentials
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MentorLogin;
