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
                
                // Sorting by date and time for upcoming games
                const sortedGames = data.sort((a, b) => {
                    if (a.status === 'Final' && b.status === 'Final') {
                        // Both games are final, sort by date descending
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    } else if (a.status !== 'Final' && b.status !== 'Final') {
                        // Both games are upcoming, compare by date and then by time
                        const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                        if (dateComparison !== 0) return dateComparison;
                        
                        const timeA = parseInt(a.status.split(':')[0]);
                        const timeB = parseInt(b.status.split(':')[0]);
                        return timeA - timeB;
                    } else {
                        // One game is final and one is upcoming, place final games after upcoming ones
                        return a.status === 'Final' ? 1 : -1;
                    }
                });

                setGames(sortedGames);
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