import React,{useState,useEffect} from 'react'
import { AiOutlineFullscreen, AiOutlineSetting, AiOutlineFullscreenExit, AiOutlineTeam } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function PreferenceNav({settings,setSettings}) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [roomId, setRoomId] = useState("");
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [languages, setLanguages] = useState([]);
	const [loadingLanguages,setLoadingLanguages] = useState(true)
	const [selectedLanguage, setSelectedLanguage] = useState(null)
	console.log(selectedLanguage)

	const navigate = useNavigate();

	const handleButtonClick = () => {
		setIsModalOpen(true); // Open modal on button click
	  };
	
	  const createRoom = () => {
		const newRoomId = uuidv4().slice(0, 8); // Generate a short room ID
		setRoomId(newRoomId); // Set room ID for display
	  };
	
	  const joinRoom = () => {
		if (roomId.trim() !== "") {
		 localStorage.setItem('roomId',roomId);
		 toast("CODE JAM STARTED")
		} else {
		  alert("Enter a valid Room ID!");
		}
	  };
	
	  const copyRoomId = () => {
		navigator.clipboard.writeText(roomId);
		alert("Room ID copied!");
	  };
	
	useEffect(() => {
		const fetchData = async () => {
			try {
			  const response = await fetch('http://127.0.0.1:8000/languages/');
		  
			  if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			  }
		  
			  const data = await response.json();
		      console.log(data)
			  // Log the response for further investigation
			//   console.log('Response:', data.languages);
		  
			  // Set languages in the state
			  setLanguages(data);
			  // Set an initial default language if needed
			  setSelectedLanguage(JSON.parse(localStorage.getItem('selected_language'))|| languages[0])
			} catch (error) {
			  console.error('Error fetching languages:', error);
			}
		  };
		  setLoadingLanguages(true)
		  fetchData();
		  setLoadingLanguages(false)
	  }, []);

	const handleFullScreen = ()=>{
		if (isFullScreen) {
			document.exitFullscreen();
			} else {
			document.documentElement.requestFullscreen();
			}
			setIsFullScreen(!setIsFullScreen);
	}

	useEffect(() => {
		function exitHandler(e) {
		  if (!document.fullscreenElement) {
			setIsFullScreen(false);
			return;
		  }
		  setIsFullScreen(true);
		}
		if (document.addEventListener) {
		  document.addEventListener("fullscreenchange", exitHandler);
		  document.addEventListener("webkitfullscreenchange", exitHandler); //Safari and Google Chrome 
		  document.addEventListener("mozfullscreenchange", exitHandler); //Firefox
		  document.addEventListener("MSFullscreenChange", exitHandler); //Internet Explorer and Microsoft Edge)
		}
	  }, [isFullScreen]);

	  const handleLanguageChange = (selectedLanguage) => {
		setSelectedLanguage(selectedLanguage)
		localStorage.setItem('selected_language',JSON.stringify(selectedLanguage))
	  };

  return (
    <div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full'>
			{!loadingLanguages && <div className='flex items-center text-white'>
				<select
				value={selectedLanguage?.id}
				onChange={(e) =>{
						handleLanguageChange(
						languages.find((lang) => lang.id === parseInt(e.target.value))
						)
					}
				}
				className='mx-0 px-2 py-1.5 rounded bg-dark-fill-3 text-dark-label-2 focus:outline-none'
				>
				{languages.map((lang) => (
					<option key={lang.id} value={lang.id} className='cursor-pointer bg-black text-white hover:bg-dark-fill-3 rounded-lg' >
					{lang.name}
					</option>
				))}
				</select>
			</div>}

			<div className='flex items-center m-2'>
				<button className='preferenceBtn group'
				onClick={()=>setSettings({...settings,settingsModalIsOpen:true})}
				>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						<AiOutlineSetting />
					</div>
					<div className='preferenceBtn-tooltip'>Settings</div>
				</button>
	         </div>
			 <div className='flex items-center m-2'>
				<button className='preferenceBtn group'
				onClick={()=>setSettings({...settings,settingsModalIsOpen:true})}
				>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						<AiOutlineFullscreen />
					</div>
					<div className='preferenceBtn-tooltip'>Full Screen</div>
				</button>
				
	        </div>

			  {/* Collaborate Icon */}
			  <div className="flex items-center m-2">
        <button 
          className="preferenceBtn group" 
          onClick={handleButtonClick} 
        >
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineTeam />
          </div>
          <div className="preferenceBtn-tooltip">Collaborate</div>
        </button>
      </div>

      {/* Modal - Collaborate Room Create/Join */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-dark-layer-3 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-white text-center mb-4">Collaborate in a Room</h2>
            
            <div className="flex flex-col space-y-4">
              {/* Create Room */}
              <div>
                <button
                  className="w-full py-2 bg-blue-600 text-white rounded-lg"
                  onClick={createRoom}
                >
                  Create Room
                </button>
                {roomId && (
                  <div className="mt-4 text-center text-white">
                    <p>Room ID: <strong>{roomId}</strong></p>
                    <button 
                      className="mt-2 py-1 px-3 bg-gray-700 text-white rounded-lg"
                      onClick={copyRoomId}
                    >
                      Copy Room ID
                    </button>
                    <button 
                      className="mt-2 py-1 px-3 bg-green-600 text-white rounded-lg"
                      onClick={joinRoom}
                    >
                      Enter Room
                    </button>
                  </div>
                )}
              </div>

              {/* Join Room */}
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  className="p-2 bg-dark-fill-3 text-white rounded-lg"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <button 
                  className="py-2 bg-purple-600 text-white rounded-lg"
                  onClick={joinRoom}
                >
                  Join Room
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-white text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
	  </div>
  )
}