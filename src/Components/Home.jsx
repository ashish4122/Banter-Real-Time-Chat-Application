import React from 'react'
import ChatPanel from './ChatPanel';
import ChatWindow from './ChatWindow';

function Home() {

  return (
    <main className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      {/* Top bar background */}
      <div className="absolute top-0 h-[130px] bg-gradient-to-r from-teal-800 via-gray-900 to-gray-800 w-full shadow-lg" />
      <div className="h-screen absolute w-full p-5">
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 w-full h-full shadow-2xl flex rounded-2xl border border-gray-700">
          {/* Conditional: chat list, profile */}
          <ChatPanel />
          {/* <div>Empty Chat</div>:<div>Individual Chat</div> */}
          <ChatWindow />
        </div>
      </div>
    </main>
  )
}

export default Home