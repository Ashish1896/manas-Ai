import { SignUp as ClerkSignUp, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  if (isLoaded && isSignedIn) {
    navigate('/dashboard', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Manas Svasthya</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ClerkSignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors',
                card: 'shadow-none border-0',
                headerTitle: 'text-gray-900 font-semibold',
                headerSubtitle: 'text-gray-600',
                socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50 transition-colors',
                formFieldInput: 'border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent',
                footerActionLink: 'text-green-600 hover:text-green-700',
              }
            }}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
          />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/sign-in" 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
