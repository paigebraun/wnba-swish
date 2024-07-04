import { useState, useEffect } from "react";
import { Game } from "../types/Game";

import UpcomingGames from "./UpcomingGames";
import PreviousGames from "./PreviousGames";

const OverallSchedule: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/schedule`);
                if (!response.ok) {
                    throw new Error("Failed to fetch schedule");
                }
                const data: Game[] = await response.json();
                setGames(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            } catch (error) {
                console.error("Error fetching schedule:", error);
            }
        };

        fetchSchedule();
    }, []);

    return (
        <>
           <UpcomingGames games={games} />
           <PreviousGames games={games} />
        </>
    );
}

export default OverallSchedule;