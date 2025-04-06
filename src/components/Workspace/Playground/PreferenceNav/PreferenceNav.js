import React, { useState, useEffect } from 'react';
import {
  AiOutlineFullscreen,
  AiOutlineSetting,
  AiOutlineFullscreenExit,
  AiOutlineTeam
} from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

export default function PreferenceNav({ settings, setSettings }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleVideoClick = () => {
    localStorage.setItem('videoId',100);
	window.location.reload();
  };

  const createRoom = () => {
    const newRoomId = uuidv4().slice(0, 8);
    setRoomId(newRoomId);
  };

  const joinRoom = () => {
    if (roomId.trim() !== '') {
      localStorage.setItem('roomId', roomId);
      setIsModalOpen(false);
      toast('CODE JAM STARTED');
      window.location.reload();
    } else {
      alert('Enter a valid Room ID!');
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied!');
  };

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/languages/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLanguages(data);

        // Set selected language only after fetching
        const storedLanguage = JSON.parse(localStorage.getItem('selected_language'));
        if (storedLanguage) {
          setSelectedLanguage(storedLanguage);
        } else if (data.length > 0) {
          setSelectedLanguage(data[0]);
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      } finally {
        setLoadingLanguages(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      } else {
        setIsFullScreen(true);
      }
    };

    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);

    return () => {
      document.removeEventListener('fullscreenchange', exitHandler);
      document.removeEventListener('webkitfullscreenchange', exitHandler);
      document.removeEventListener('mozfullscreenchange', exitHandler);
      document.removeEventListener('MSFullscreenChange', exitHandler);
    };
  }, []);

  const handleLanguageChange = (selected) => {
    setSelectedLanguage(selected);
    localStorage.setItem('selected_language', JSON.stringify(selected));
  };

  return (
    <div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full">
      {!loadingLanguages && (
        <div className="flex items-center text-white">
          <select
            value={selectedLanguage?.id}
            onChange={(e) =>
              handleLanguageChange(
                languages.find((lang) => lang.id === parseInt(e.target.value))
              )
            }
            className="mx-0 px-2 py-1.5 rounded bg-dark-fill-3 text-dark-label-2 focus:outline-none"
          >
            {languages.map((lang) => (
              <option
                key={lang.id}
                value={lang.id}
                className="cursor-pointer bg-black text-white hover:bg-dark-fill-3 rounded-lg"
              >
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center m-2">
        <button
          className="preferenceBtn group"
          onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}
        >
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting />
          </div>
          <div className="preferenceBtn-tooltip">Settings</div>
        </button>
      </div>

      <div className="flex items-center m-2">
        <button className="preferenceBtn group" onClick={handleFullScreen}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            {isFullScreen ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
          </div>
          <div className="preferenceBtn-tooltip">
            {isFullScreen ? 'Exit Fullscreen' : 'Full Screen'}
          </div>
        </button>
      </div>

      <div className="flex items-center m-2">
        <button className="preferenceBtn group" onClick={handleButtonClick}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineTeam />
          </div>
          <div className="preferenceBtn-tooltip">Collaborate</div>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-dark-layer-3 p-6 rounded-xl w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-white text-xl"
              aria-label="Close Modal"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Collaborate in a Room
            </h2>

            <div className="flex flex-col space-y-4">
              <div>
                <button
                  className="w-full py-2 bg-blue-600 text-white rounded-lg"
                  onClick={createRoom}
                >
                  Create Room
                </button>
                {roomId && (
                  <div className="mt-4 text-center text-white">
                    <p>
                      Room ID: <strong>{roomId}</strong>
                    </p>
                    <button
                      className="mt-2 py-1 px-3 bg-gray-700 text-white rounded-lg"
                      onClick={copyRoomId}
                    >
                      Copy Room ID
                    </button>
                    <button
                      className="mt-2 ml-2 py-1 px-3 bg-green-600 text-white rounded-lg"
                      onClick={joinRoom}
                    >
                      Enter Room
                    </button>
                  </div>
                )}
              </div>

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
          </div>
        </div>
      )}

<div className="flex items-center m-2">
        <button className="preferenceBtn group" onClick={handleVideoClick}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineTeam />
          </div>
          <div className="preferenceBtn-tooltip">VideoChat</div>
        </button>
      </div>
    </div>
  );
}
