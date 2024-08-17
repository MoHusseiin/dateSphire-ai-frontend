import { User, MessageCircle, X, Heart } from 'lucide-react'
import './App.css'

function App() {

  const ProfileSelector = () => (
    <div className="rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="relative">
        <img src="http://127.0.0.1:8081/608e55f4-3531-485f-b7ce-8fb158b1c9e4.jpg"/>
        <div className="absolute bottom-0 left-0 right-0 text-white p-4 bg-gradient-to-t from-black">
          <h2 className='text-3xl font-bold'>Lina Kim, 31</h2>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-4">Architect and designer. Passionate about creating spaces that inspire. Looking for someone who appreciates creativity and innovation.</p>
      </div>
      <div className="p-4 flex justify-center space-x-4">
        <button className="bg-red-500 rounded-full p-4 text-white hover:bg-red-700"
          onClick={() => console.log("left")}>
          <X size={24}/>
        </button>
        <button className="bg-green-500 rounded-full p-4 text-white hover:bg-green-700"
          onClick={() => console.log("right")}>
          <Heart size={24}/>
        </button>
      </div>
  
    </div>
  );

  return (
    <>
    <div className='max-w-md mx-auto p-4'>
      <nav className='flex justify-between'>
        <User />
        <MessageCircle />
      </nav>
      <ProfileSelector/>
    </div>
    </>
  )
}

export default App
