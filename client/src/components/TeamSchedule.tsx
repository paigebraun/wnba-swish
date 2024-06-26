import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Game } from "../types/Game";

import UpcomingGames from "./UpcomingGames";
import PreviousGames from "./PreviousGames";

const TeamSchedule: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();

    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/${teamId}/schedule`);
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
    }, [teamId]);

    if (!teamId) {
        return <div>Error: No team ID provided</div>;
    }

    return (
        <>
           <UpcomingGames games={games} />
           <PreviousGames games={games} teamId={teamId} />
        </>
    );
}

export default TeamSchedule;