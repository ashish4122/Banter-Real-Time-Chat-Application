import React from 'react';
import { Link, useParams } from "react-router-dom";

function UserCard(props) {
    const params = useParams();
    const { userObject } = props;
    const isActive = params?.chatId === userObject.id;

    return (
        <Link
            to={`/${userObject.id}`}
            className={`flex gap-4 items-center px-4 py-3 rounded-lg cursor-pointer transition-colors
                ${isActive ? "bg-teal-900" : "hover:bg-gray-800"}
            `}
        >
            <img
                src={userObject.userData.profile_pic}
                alt=""
                className="w-12 h-12 object-cover rounded-full border border-gray-700"
            />
            <h2 className="flex-grow text-gray-200 font-medium">{userObject.userData.name}</h2>
        </Link>
    );
}

export default UserCard;