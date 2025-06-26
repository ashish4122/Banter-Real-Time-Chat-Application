import { ArrowLeft, CheckIcon, Edit2Icon, Loader2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile(props) {
    const navigate = useNavigate();
    const { userData, logout, updateName, updateStatus, isUploading, error, updatePhoto } = useAuth();
    const [name, setName] = useState(userData?.name || "");
    const [status, setStatus] = useState(userData?.status || "");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handlePhotoUpload = (e) => {
        const img = e.target.files?.[0];
        if (img) {
            updatePhoto(img); // Upload image to Firebase
        }
    };

    return (
        <div className="w-[30vw] min-w-[350px] h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 border-r border-gray-800">
            {/* Top bar */}
            <div className="bg-gray-900 text-white py-4 text-lg px-4 flex items-center gap-6 border-b border-gray-800 rounded-tl-2xl">
                <button onClick={props.onBack}>
                    <ArrowLeft />
                </button>
                <div> Profile</div>
            </div>

            {/* Profile data */}
            <div className="w-full flex flex-col items-center justify-center py-16 gap-8 mt-8">
                <label
                    className={`group relative rounded-full overflow-hidden cursor-pointer ${isUploading ? "pointer-events-none" : ""}`}
                >
                    <img
                        src={userData.profile_pic || "/default-user.png"}
                        alt="profile picture"
                        className="w-[160px] h-[160px] object-cover border-4 border-gray-800"
                    />
                    <input
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        className="hidden"
                        onChange={handlePhotoUpload} // Trigger photo upload
                    />
                    {isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                            <Loader2Icon className="w-6 h-6 text-teal-400 animate-spin z-10" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40 z-10">
                            <Edit2Icon className="w-6 h-6 text-white" />
                        </div>
                    )}
                </label>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                {/* Name section */}
                <div className="flex flex-col bg-gray-800 w-full py-4 px-8 rounded-xl border border-gray-700">
                    <label className="text-sm text-teal-400 mb-2">Your name</label>
                    <div className="flex items-center w-full">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none"
                        />
                        <button onClick={() => updateName(name)}>
                            <CheckIcon className="w-5 h-5 text-teal-400" />
                        </button>
                    </div>
                </div>

                {/* Status section */}
                <div className="flex flex-col bg-gray-800 w-full py-4 px-8 rounded-xl border border-gray-700">
                    <label className="text-sm text-teal-400 mb-2">Status</label>
                    <div className="flex items-center w-full">
                        <input
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            placeholder="Update your status..."
                            className="w-full bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none"
                        />
                        <button onClick={() => updateStatus(status)}>
                            <CheckIcon className="w-5 h-5 text-teal-400" />
                        </button>
                    </div>
                </div>

                {/* Logout button */}
                <button
                    className="mt-8 px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow transition-all duration-200"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Profile;

