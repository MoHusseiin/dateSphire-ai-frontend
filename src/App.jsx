import { User, MessageCircle, X, Heart, Send } from 'lucide-react'
import './App.css'
import react, { useState, useEffect } from 'react';

const fetchRandomProfile = async () => {
  const response = await fetch("http://localhost:8080/profiles/random");
  if(!response.ok){
    throw new Error ("Failed to fetch profile.");
  }
  return response.json();
}

// saveSwipe
const match = async (profileId) => {
  const response = await fetch("http://localhost:8080/match", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ profileId })
  });
  if(!response.ok){
    throw new Error ( 'Failed to match with profile id = ' + { profileId } );
  }
}

const fetchMatches = async () => {
  const response = await fetch("http://localhost:8080/matches");
  if(!response.ok){
    throw new Error ("Failed to fetch matches.");
  }
  return response.json();
}

const fetchConversationById = async (conversationId) => {
  const response = await fetch(`http://localhost:8080/conversations/${conversationId}`);
  if(!response.ok){
    throw new Error ("Failed to fetch Conversation By Id = " + { conversationId });
  }
  return response.json();
}

const sendMessage = async (conversationId, message) => {
  const response = await fetch(`http://localhost:8080/conversations/${conversationId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ messageText: message, authorId: 'user' })
  });
  if(!response.ok){
    throw new Error ('Failed to send a message Conversation By Id = ' + { conversationId });
  }
}

const ProfileSelector = ({ profile, onSwipe }) => (
  profile ? 
  (
    <div className="rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="relative">
        <img src={ 'http://127.0.0.1:8081/' + profile.imageUrl }/>
        <div className="absolute bottom-0 left-0 right-0 text-white p-4 bg-gradient-to-t from-black">
          <h2 className='text-3xl font-bold'>{profile.firstName} {profile.lastName}, {profile.age}</h2>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-4">{profile.bio}</p>
      </div>
      <div className="p-4 flex justify-center space-x-4">
        <button className="bg-red-500 rounded-full p-4 text-white hover:bg-red-700"
          onClick={() => onSwipe( profile.id, "pass" )}>
          <X size={24}/>
        </button>
        <button className="bg-green-500 rounded-full p-4 text-white hover:bg-green-700"
          onClick={() => onSwipe( profile.id, "like" )}>
          <Heart size={24}/>
        </button>
      </div>
  
    </div>
  ) : (<div>Loading...</div>)
);

const MatchesList = ({ matches, onSelectMatch }) => 
{
  return (
    <div className="rounded-lg shadow-lg p-4">
    <h2 className="text-2x1 font-bold mb-4">Matches</h2>
    <ul>
      {
        matches.map(match => (
          <li key={match.profile.id} className="mb-2">
            <button className="w-full hover:bg-gray-100 rounded flex item-center" onClick={ () => onSelectMatch(match.profile, match.conversationId) }>
              <img src={ 'http://127.0.0.1:8081/' + match.profile.imageUrl } className="w-16 h-16 rounded-full mr-3 object-cover"/>
              <span>
                <h3 className="font-bold">{match.profile.firstName} {match.profile.lastName}</h3>
              </span>
            </button>
          </li>
        ))
      }
   </ul>
  </div>
  );
}

const ChatScreen = ({ currentMatch, conversation, refreshState }) => {
  const [input, setInput] = useState('');

  const handleSend = async (conversation, input) => {
    if (input.trim()) {
      await sendMessage(conversation.id, input.trim());
      setInput('');
    }
    refreshState();
  }

  return currentMatch ? 
  (
    <div className="rounded-lg shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Chat with {currentMatch.firstName} {currentMatch.lastName}</h2>
      <div className="h-[50vh] border rounded overflow-y-auto mb-4 p-4">
        {
          conversation.messages.map((message, index) => (
            <dev key={index}>
              <div className="mb-4 p-2 rounded bg-gray-100">{message.messageText}</div>
            </dev>
          ))
        }
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border-2 border-gray-300 rounded-full py-2 px-4 mr-2 focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
        />
        <button 
          className="bg-blue-500 text-white rounded p-2"
          onClick={() => handleSend(conversation, input)}
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  ) : (<div>Loading...</div>);
}

function App() {

  const [currentScreen, setCurrentScreen] = useState('profile');
  const [currentProfile, setcurrentProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [currentMatchAndConversation, setCurrentMatchAndConversation] = useState({ match: {}, conversation: [] });

  useEffect(() => {
    loadRandomProfile();
    loadMatches();
  }, {});

  const loadRandomProfile = async () => {
    try {
      const profile = await fetchRandomProfile();
      setcurrentProfile(profile);
    }catch (error) {
      console.error(error);
    }
  }

  const loadMatches = async () => {
    try {
      const matches = await fetchMatches();
      setMatches(matches);
    }catch (error) {
      console.error(error);
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return <ProfileSelector profile={currentProfile} onSwipe={onSwipe} />;
      case 'matches':
        return <MatchesList matches={matches} onSelectMatch={ onSelectMatch }/>;
      case 'chat':
        return <ChatScreen 
              currentMatch={currentMatchAndConversation.match} 
        conversation={currentMatchAndConversation.conversation}  
        refreshState={refreshChatState} />;
    }
  }

  const refreshChatState = async () => {
    const conversation = await fetchConversationById(currentMatchAndConversation.conversation.id);
    setCurrentMatchAndConversation({match: currentMatchAndConversation.match, conversation: conversation});
  }

  const onSwipe = async (profileId, direction) => {
    loadRandomProfile();
    if(direction === 'like' && profileId) {
      await match(profileId)
      await loadMatches()
    }
  };

  const onSelectMatch = async (profile, conversationId) => {
    const conversation = await fetchConversationById(conversationId);
    setCurrentMatchAndConversation({ match: profile, conversation: conversation});
    setCurrentScreen('chat');
  }

  return (
    <>
    <div className='max-w-md mx-auto p-4'>
      <nav className='flex justify-between mb-4'>
        <User onClick={ () => setCurrentScreen("profile") }/>
        <MessageCircle onClick={ () => setCurrentScreen("matches") } />
      </nav>
      { renderScreen() }
    </div>
    </>
  )
}

export default App
