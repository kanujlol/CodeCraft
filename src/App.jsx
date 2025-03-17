import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoomSelection from "./components/RoomSelection";
import CodeEditor from "./components/CodeEditor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomSelection />} />
        <Route path="/room/:roomId" element={<CodeEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
