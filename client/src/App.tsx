import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import TeamView from './pages/TeamView';
import PlayerView from './pages/PlayerView';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:teamId" element={<TeamView />} />
        <Route path="/:playerId" element={<PlayerView />} />
      </Routes>
    </>
  )
}

export default App;
