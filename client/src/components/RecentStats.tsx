import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toZonedTime } from "date-fns-tz";
import playerStatsData from "../data/player_stats.json";
import gamesData from "../data/games.json";

import Toggle from "./Toggle";
import Glossary from "./Glossary";

function RecentStats() {
    const { playerId } = useParams<{ playerId: string }>();

    const location = useLocation();
    const { teamId } = location.state as { teamId: string };

    interface PlayerStat {
        game_id: string | number;
        team_id: number;
        min: string | null;
        fgm: number | string | null;
        fga: number | string | null;
        fg_pct: string | number | null;
        fg3m: number | string | null;
        fg3a: number | string | null;
        fg3_pct: string | number | null;
        ftm: number | string | null;
        fta: number | string | null;
        ft_pct: string | number | null;
        oreb: number | string | null;
        dreb: number | string | null;
        reb: number | string | null;
        ast: number | string | null;
        stl: number | string | null;
        blk: number | string | null;
        tos: number | string | null;
        pf: number | string | null;
        pts: number | string | null;
        plus_minus: string | number | null;
        date: string;
        home_team_abbr: string;
        away_team_abbr: string;
        home_team_id: number;
        home_score: string | number;
        away_score: string | number;
        player_id: number;
    }

    const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
    const [enabled, setEnabled] = useState(false);
    const [validPlayerStats, setValidPlayerStats] = useState(false);

    useEffect(() => {
        const fetchPlayerStats = async () => {
            try {
                const filteredPlayerStats = playerStatsData.filter(
                    (stat) => stat.player_id.toString() === playerId
                );

                const combinedStats = filteredPlayerStats
                    .map((stat) => {
                        // Find the corresponding game for each stat based on game_id
                        const game = gamesData.find(
                            (g) => g.game_id === stat.game_id
                        );
                        if (game) {
                            return {
                                ...stat,
                                date: game.date,
                                home_team_abbr: game.home_team_abbr,
                                away_team_abbr: game.away_team_abbr,
                                home_team_id: game.home_team_id,
                                home_score: game.home_score,
                                away_score: game.away_score,
                                arena: game.arena,
                                arena_city: game.arena_city,
                                arena_state: game.arena_state,
                            };
                        }
                        return null;
                    })
                    .filter((stat) => stat !== null);

                // Filter out null values (in case no corresponding game is found)
                const validStats = combinedStats.filter(
                    (stat) => stat !== null
                );

                // Sort stats by date in descending order (most recent first)
                const sortedStats = validStats.sort((a: any, b: any) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB.getTime() - dateA.getTime();
                });

                setPlayerStats(sortedStats);
                setValidPlayerStats(validStats.length > 0);
            } catch (error) {
                console.error("Error fetching player stats or games:", error);
            }
        };

        fetchPlayerStats();
    }, [playerId]);

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const zonedDate = toZonedTime(date, "UTC");
        const day: string = String(zonedDate.getDate()).padStart(2, "0");
        const month: string = String(zonedDate.getMonth() + 1).padStart(2, "0");
        const year: number = zonedDate.getFullYear();

        return `${month}.${day}.${year}`;
    }

    const handleToggleClick = () => {
        setEnabled(!enabled);
    };

    const determineResult = (playerStat: PlayerStat): string => {
        const isHomeTeam = Number(playerStat.home_team_id) === Number(teamId);

        if (
            isHomeTeam &&
            Number(playerStat.home_score) > Number(playerStat.away_score)
        ) {
            return "W";
        }
        if (
            !isHomeTeam &&
            Number(playerStat.away_score) > Number(playerStat.home_score)
        ) {
            return "W";
        } else {
            return "L";
        }
    };

    return (
        <>
            <div className="flex gap-4 items-center mt-10 mb-4">
                <h1 className="font-bold text-2xl md:text-4xl">Recent Stats</h1>
                {!validPlayerStats ? (
                    <></>
                ) : (
                    <Toggle enabled={enabled} onClick={handleToggleClick} />
                )}
            </div>
            {!validPlayerStats ? (
                <p>No recent player stats.</p>
            ) : (
                <div>
                    {enabled && (
                        <div className="mb-4">
                            <Glossary page="recent-stats" />
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border-separate border-spacing-y-2">
                            <thead className="bg-black text-white text-left text-xs">
                                <tr>
                                    <th className="p-2">DATE</th>
                                    <th className="p-2">MATCHUP</th>
                                    <th className="p-2">RESULT</th>
                                    <th className="p-2">MIN</th>
                                    <th className="p-2">PTS</th>
                                    <th className="p-2">FGM</th>
                                    <th className="p-2">FGA</th>
                                    <th className="p-2">FGM-3</th>
                                    <th className="p-2">FGA-3</th>
                                    <th className="p-2">FTM</th>
                                    <th className="p-2">FTA</th>
                                    <th className="p-2">OREB</th>
                                    <th className="p-2">DREB</th>
                                    <th className="p-2">REB</th>
                                    <th className="p-2">AST</th>
                                    <th className="p-2">STL</th>
                                    <th className="p-2">BLK</th>
                                    <th className="p-2">TO</th>
                                    <th className="p-2">PF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playerStats.map((playerStat, index) => (
                                    <tr
                                        key={index}
                                        className="bg-gray-100 mb-4">
                                        <td className="py-2 px-2 font-bold">
                                            {formatDate(playerStat.date)}
                                        </td>
                                        <td className="px-2 text-sm font-bold text-wOrange">{`${playerStat.away_team_abbr} VS ${playerStat.home_team_abbr}`}</td>
                                        <td className="px-2">
                                            {determineResult(playerStat)}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.min
                                                ? parseFloat(
                                                      playerStat.min.split(
                                                          ":"
                                                      )[0]
                                                  )
                                                : "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.pts ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.fgm ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.fga ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.fg3m ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.fg3a ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.ftm ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.fta ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.oreb ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.dreb ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.reb ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.ast ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.stl ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.blk ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.tos ?? "-"}
                                        </td>
                                        <td className="px-2">
                                            {playerStat.pf ?? "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}

export default RecentStats;
