import { useState, useEffect, ChangeEvent } from "react";
import { TbSearch } from "react-icons/tb";
import { RiCloseLargeFill } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  player_id: string;
  first_name: string;
  last_name: string;
  dob: string;
  height: string;
  weight: string;
  pos: string;
  hcc: string;
  exp: string;
  number: number;
  team_logo: string;
  team_id: string;
}

const Search: React.FC = () => {
  const style = { strokeWidth: "3px" };
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [buttonDelay, setButtonDelay] = useState<number>(0);
  const navigate = useNavigate();

  // Fetch players from database for search results
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/allplayers`)
      .then(response => response.json())
      .then((data: Player[]) => setPlayers(data))
      .catch(error => console.error("Error fetching players:", error));
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const normalizedQuery = searchQuery.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      const results = players.filter(player => {
        const fullName = `${player.first_name} ${player.last_name}`.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        return fullName.includes(normalizedQuery);
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, players]);

  // Switch between search button and cancel button
  const handleBtn = () => {
    if (isSearching) {
      setButtonDelay(300);
      setTimeout(() => {
        setIsSearching(false);
        setSearchQuery("");
        setSearchResults([]);
      }, 300);
    } else {
      setButtonDelay(0);
      setIsSearching(true);
    }
  };

  // Query names while user is typing in search
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };


  // Navigate to player page when player is clicked
  const handlePlayerClick = (player: Player) => {
    navigate(`/player/${player.player_id}`, {
      state: {
        dob: player.dob,
        height: player.height,
        weight: player.weight,
        prior: player.hcc,
        pos: player.pos,
        exp: player.exp,
        name: `${player.first_name} ${player.last_name}`,
        number: player.number,
        teamLogo: player.team_logo,
        teamId: player.team_id,
      },
    });
    handleBtn();
  };

  return (
    <>
      <AnimatePresence>
        <motion.button
          key="searchButton"
          whileHover={{ scale: 1.1 }}
          initial={{ scale: 1 }}
          animate={{ scale: isSearching ? 0 : 0.9 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3, delay: buttonDelay / 1000 }}
          whileTap={{ scale: 0.9 }}
          className="bg-wOrange md:mr-2 w-12 flex items-center justify-center rounded-full text-white text-xl py-2 z-20"
          onClick={handleBtn}
          style={{ visibility: isSearching ? 'hidden' : 'visible' }}
        >
          <TbSearch style={style} />
        </motion.button>
      </AnimatePresence>
      <AnimatePresence>
        {isSearching && (
          <motion.div
            key="searchInput"
            initial={{ x: 100, opacity: 1 }}
            animate={{ x: 80 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="relative right-24 z-10"
          >
            <input
              autoFocus
              type="text"
              placeholder="Search players"
              className="relative border-solid border-0 border-b-4 border-wOrange px-2 py-1 relative focus:outline-none md:w-60"
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button
              className="text-wOrange absolute right-2 top-2 text-sm"
              onClick={handleBtn}
            >
              <RiCloseLargeFill style={style} />
            </button>
            {searchResults.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 max-h-40 overflow-y-scroll">
                {searchResults.map((player, index) => (
                    <li
                        key={index}
                        className="group px-2 py-1 hover:bg-gray-100 cursor-pointer relative"
                        onClick={() => handlePlayerClick(player)}
                    >
                        {player.first_name} {player.last_name}
                        <div className="hidden absolute right-3 top-1/2 transform -translate-y-1/2 bg-wOrange pl-5 pr-2 py-1 rounded-2xl text-white md:group-hover:block">
                        <FaArrowRight />
                        </div>
                    </li>
                    ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Search;