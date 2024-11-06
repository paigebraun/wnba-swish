import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Game } from "../types/Game";
import gamesData from "../data/games.json";
import UpcomingGames from "./UpcomingGames";
import PreviousGames from "./PreviousGames";

const TeamSchedule: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();

    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const fetchSchedule = () => {
            try {
                const teamGames = gamesData.filter(
                    (game) =>
                        game.home_team_id.toString() === teamId ||
                        game.away_team_id.toString() === teamId
                );

                if (teamGames.length === 0) {
                    throw new Error("No games found for this team");
                }

                const sortedGames = teamGames.sort(
                    (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                setGames(sortedGames);
            } catch (error) {
                console.error("Error loading schedule:", error);
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
};

export default TeamSchedule;
