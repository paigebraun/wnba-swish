import { useState, useEffect } from "react";
import { Game } from "../types/Game";
import gamesData from "../data/games.json";
import UpcomingGames from "./UpcomingGames";
import PreviousGames from "./PreviousGames";

const OverallSchedule: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        try {
            // Sorting by date and time for upcoming games
            const sortedGames = gamesData.sort((a, b) => {
                if (a.status === "Final" && b.status === "Final") {
                    // Both games are final, sort by date descending
                    return (
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                } else if (a.status !== "Final" && b.status !== "Final") {
                    // Both games are upcoming, compare by date and then by time
                    const dateComparison =
                        new Date(a.date).getTime() - new Date(b.date).getTime();
                    if (dateComparison !== 0) return dateComparison;

                    const timeA = parseInt(a.status.split(":")[0]);
                    const timeB = parseInt(b.status.split(":")[0]);
                    return timeA - timeB;
                } else {
                    // One game is final and one is upcoming, place final games after upcoming ones
                    return a.status === "Final" ? 1 : -1;
                }
            });

            setGames(sortedGames);
        } catch (error) {
            console.error("Error processing schedule:", error);
        }
    }, []);

    return (
        <>
            <UpcomingGames games={games} />
            <PreviousGames games={games} />
        </>
    );
};

export default OverallSchedule;
