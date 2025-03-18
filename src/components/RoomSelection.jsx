import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function RoomSelection() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    const newRoomId = uuidv4().slice(0, 8); // Generate short room ID
    setRoomId(newRoomId); // Set room ID for display
  };

  const joinRoom = () => {
    if (roomId.trim() !== "") {
      navigate('/room/${roomId}');
    } else {
      alert("Enter a valid Room ID!");
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied!");
  };

  return (
    <div>
      <h1>Join or Create a Room</h1>

      <button onClick={createRoom}>Create Room</button>

      {roomId && (
        <div>
          <p>Room ID: <strong>{roomId}</strong></p>
          <button onClick={copyRoomId}>Copy Room ID</button>
          <button onClick={joinRoom}>Enter Room</button>
        </div>
      )}

      <hr />

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default RoomSelection;