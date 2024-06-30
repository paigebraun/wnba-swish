import { Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import TeamView from './pages/TeamView';
import PlayerView from './pages/PlayerView';
import Standings from "./pages/Standings";
import Schedule from "./pages/Schedule";


function App() {
  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:teamId" element={<TeamView />} />
        <Route path="/:playerId" element={<PlayerView />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </>
  )
}

export default App;
