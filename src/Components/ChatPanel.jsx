import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import React from 'react'
import { db } from "../../firebase";
import { CircleFadingPlusIcon, Loader2Icon, MessageSquare, SearchIcon, UserRoundIcon } from "lucide-react";
import Profile from "./Profile";
import UserCard from "./UserCard";
import { useAuth } from "./AuthContext";

function ChatPanel() {
    {/* list of users leke aane from your firebase */ }
    const [users, setUsers] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { userData } = useAuth();


    useEffect(() => {
        const getUsers = async () => {
            // isme collection pass and data milta hai 
            const data = await getDocs(collection(db, 'users'));
            const arrayOfUser = data.docs.map((docs) => { return { userData: docs.data(), id: docs.id } });
            console.log("18", arrayOfUser);
            setUsers(arrayOfUser);
            setLoading(false);
        };

        getUsers();
    }, []);

    let filterdUsers = users;
    if (searchQuery) {
        // filter chats based on search query
        filterdUsers = users.filter((user) =>
            user.userData.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
    }

    const onBack = () => { setShowProfile(false) }
    if (showProfile == true) {
        return <Profile onBack={onBack} />
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 w-[30vw] min-w-[350px] border-r border-gray-800">
            {/* top-bar */}
            <div className="bg-gray-900 py-2 px-4 border-r border-gray-800 flex justify-between items-center gap-2 rounded-tl-2xl">
                <button
                    onClick={() => { setShowProfile(true) }}
                >
                    <img
                        src={userData.profile_pic||"/default-user.png"}
                        alt="profile picture"
                        className="w-10 h-10 rounded-full object-cover border border-gray-700"
                    />
                </button>

                <div className="flex items-end justify-center gap-6 mx-4">
                    <CircleFadingPlusIcon className="w-6 h-6 text-teal-400" />
                    <MessageSquare className="w-6 h-6 text-gray-300" />
                    <UserRoundIcon className="w-6 h-6 text-gray-300" />
                </div>
            </div>

            {/* chat List */}
            {
                isLoading ? (
                    <div className="h-full w-full flex justify-center items-center">
                        <Loader2Icon className="w-10 h-10 animate-spin text-teal-400" />
                    </div>
                ) : (
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 py-2 px-3 h-full">
                        {/* Search Bar  */}
                        <div className="bg-gray-800 flex items-center gap-4 px-3 py-2 rounded-lg mb-2 border border-gray-700">
                            <SearchIcon className="w-4 h-4 text-gray-400" />
                            <input
                                className="bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none w-full"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="py-4 divide-y divide-gray-800 h-full max-h-[calc(100vh-152px)] overflow-y-scroll">
                            {filterdUsers.map(userObject => <UserCard userObject={userObject} key={userObject.id} />)}
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default ChatPanel