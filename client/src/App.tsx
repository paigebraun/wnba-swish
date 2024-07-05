import { Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import TeamView from './pages/TeamView';
import PlayerView from './pages/PlayerView';
import StandingsView from "./pages/StandingsView";
import Schedule from "./pages/Schedule";

import ScrollToTop from "./components/ScrollToTop";


function App() {
  return (
    <>
    <ScrollToTop />
    <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:teamId" element={<TeamView />} />
        <Route path="/player/:playerId" element={<PlayerView />} />
        <Route path="/standings" element={<StandingsView />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </>
  )
}

export default App;
