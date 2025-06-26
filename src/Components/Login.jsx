import React from 'react';
import { LogIn as LoginIcon, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

async function createUser(authData) {
  const user = authData.user;
  const { uid, displayName, email, photoURL } = user;
  await setDoc(doc(db, 'users', uid), {
    email,
    profile_pic: photoURL,
    name: displayName,
  });
}

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userData = await signInWithPopup(auth, new GoogleAuthProvider());
      await createUser(userData);
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      <div className="max-w-md w-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 rounded-3xl shadow-2xl p-10 border border-gray-700">
        <div className="flex justify-center mb-4">
          <div className="bg-teal-700 rounded-full p-4 shadow-lg">
            <Fingerprint className="h-12 w-12 text-white" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-center text-white mb-2 tracking-tight">Banter</h1>
        <p className="text-base text-gray-300 text-center mb-6">
          Real-time conversations, reimagined.<br />
          Sign in with Google to join the chat.
        </p>
        <button
          onClick={handleLogin}
          className="mt-2 w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg shadow-md transition-all duration-200"
        >
          <LoginIcon size={22} />
          <span>Sign in with Google</span>
        </button>
        
        {/* Removed the "No account data is shared without your consent." message */}
      </div>
      <p className="text-xs text-gray-500 mt-8 text-center">
        © {new Date().getFullYear()} Banter — Real-time conversations made simple.
      </p>
    </div>
  );
}

export default Login;