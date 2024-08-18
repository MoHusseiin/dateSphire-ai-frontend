import { User, MessageCircle, X, Heart } from 'lucide-react'
import './App.css'
import react, { useState, useEffect } from 'react';

const fetchRandomProfile = async () => {
  const response = await fetch("http://localhost:8080/profiles/random");
  if(!response.ok){
    throw new Error ("Failed to fetch profile.");
  }
  return response.json();
}

const match = async (profileId) =>{
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

function App() {

  const [currentScreen, setCurrentScreen] = useState('profile');
  const [input, setInput] = useState('');
  const [currentProfile, setcurrentProfile] = useState(null);

  useEffect(() => {
    loadRandomProfile();
  }, {});

  const loadRandomProfile = async () => {
    try {
      const profile = await fetchRandomProfile();
      setcurrentProfile(profile);
    }catch (error) {
      console.error(error);
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return <ProfileSelector profile={currentProfile} onSwipe={onSwipe} />;
      case 'matches':
        return <MatchesList onSelectMatch={ () => setCurrentScreen("chat") }/>;
      case 'chat':
        return <ChatScreen/>;

    }
  }

  const handleSend = () => {
    if(input.trim()){
      console.log(input.trim());
      setInput('');
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

  const MatchesList = ({ onSelectMatch }) => (
    <div className="rounded-lg shadow-lg p-4">
      <h2 className="text-2x1 font-bold mb-4">Matches</h2>
      <ul>
        {
          [
            {
              "id": "608e55f4-3531-485f-b7ce-8fb158b1c9e4",
              "firstName": "Lina",
              "lastName": "Kim",
              "imageUrl": "http://127.0.0.1:8081/608e55f4-3531-485f-b7ce-8fb158b1c9e4.jpg"
            },
            {
              "id": "4c7da207-9def-470a-8557-62da5420f9fa",
              "firstName": "Natalia",
              "lastName": "Lopez",
              "imageUrl": "http://127.0.0.1:8081/4c7da207-9def-470a-8557-62da5420f9fa.jpg"
            }
          ].map(match => (
            <li key={match.id} className="mb-2">
              <button className="w-full hover:bg-gray-100 rounded flex item-center" onClick={ onSelectMatch }>
                <img src={match.imageUrl} className="w-16 h-16 rounded-full mr-3 object-cover"/>
                <span>
                  <h3 className="font-bold">{match.firstName} {match.lastName}</h3>
                </span>
              </button>
            </li>
          ))
        }
     </ul>
    </div>    
  );
  
  const ChatScreen = () => (
    <div className="rounded-lg shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Chat with Lina Kim</h2>
      <div className="h-[50vh] border rounded overflow-y-auto mb-4 p-4">
        {
          [
            "Hi",
            "How are you ?"
          ].map((messege, index) => (
            <dev key={index}>
              <div className="mb-4 p-2 rounded bg-gray-100">{messege}</div>
            </dev>
          ))
        }
      </div>
      <div className="flex">
        <input 
          type="text" 
          className="border flex-1 rounded p-2 mr-2" 
          placeholder="Type a message..."
          value={input}
          onChange={ (e) => setInput(e.target.value) }
        />
        <button 
          className="bg-blue-500 text-white rounded p-2"
          onClick={ handleSend }
          >
          Send
        </button>
      </div>
    </div>
  );

  const onSwipe = (profileId, direction) => {
    if(direction === 'like' && profileId){
      match(profileId);
    }
    loadRandomProfile();
  };

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
