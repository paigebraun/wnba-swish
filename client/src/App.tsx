import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import TeamView from './pages/TeamView';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:teamName" element={<TeamView />} />
      </Routes>
    </>
    )
}

export default App;
