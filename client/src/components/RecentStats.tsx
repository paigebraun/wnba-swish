import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import Toggle from "./Toggle";
import Glossary from "./Glossary";

function RecentStats() {
    const { playerId } = useParams<{ playerId: string }>();

    const location = useLocation();
    const { teamId } = location.state as { teamId: string };

    interface PlayerStat {
        game_id: string;
        team_id: number;
        min: string | null;
        fgm: number | null;
        fga: number | null;
        fg_pct: string | null;
        fg3m: number | null;
        fg3a: number | null;
        fg3_pct: string | null;
        ftm: number | null;
        fta: number | null;
        ft_pct: string | null;
        oreb: number | null;
        dreb: number | null;
        reb: number | null;
        ast: number | null;
        stl: number | null;
        blk: number | null;
        tos: number | null;
        pf: number | null;
        pts: number | null;
        plus_minus: string | null;
        date: string;
        home_team_abbr: string;
        away_team_abbr: string;
        home_team_id: number;
        home_score: string;
        away_score: string;
    }

    const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
    const [enabled, setEnabled] = useState(false);
    const [validPlayerStats, setValidPlayerStats] = useState(false);

    useEffect(() => {
        const fetchPlayerStats = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/stats/${playerId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch player stats");
                }
                const data: PlayerStat[] = await response.json();

                // Filter out games with null stats
                const filteredStats = data.filter(stat =>
                    stat.min !== null &&
                    stat.pts !== null &&
                    stat.fgm !== null &&
                    stat.fga !== null &&
                    stat.fg3m !== null &&
                    stat.fg3a !== null &&
                    stat.oreb !== null &&
                    stat.dreb !== null &&
                    stat.reb !== null &&
                    stat.ast !== null &&
                    stat.stl !== null &&
                    stat.blk !== null &&
                    stat.tos !== null &&
                    stat.pf !== null
                );

                // Sort filteredStats by date in descending order
                filteredStats.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB.getTime() - dateA.getTime();
                });

                const hasValidStats = filteredStats.length > 0;

                setPlayerStats(filteredStats);
                setValidPlayerStats(hasValidStats);
            } catch (error) {
                console.error("Error fetching player stats:", error);
            }
        };

        fetchPlayerStats();
    }, [playerId]);

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day: string = String(date.getDate()).padStart(2, '0');
        const month: string = String(date.getMonth() + 1).padStart(2, '0');
        const year: number = date.getFullYear();
    
        return `${month}.${day}.${year}`;
    }

    const handleToggleClick = () => {
        setEnabled(!enabled);
    };

    const determineResult = (playerStat: PlayerStat): string => {
        const isHomeTeam = Number(playerStat.home_team_id) === Number(teamId);
    
        if (isHomeTeam && (Number(playerStat.home_score) > Number(playerStat.away_score))) {
            return 'W';
        } if (!isHomeTeam && (Number(playerStat.away_score) > Number(playerStat.home_score))) { 
            return 'W'
        } else {
            return 'L'
        }
    };

    return (
        <>  
            <div className='flex gap-4 items-center mt-10 mb-4'>
                <h1 className='font-bold text-2xl md:text-4xl'>Recent Stats</h1>
                {!validPlayerStats ? (<></>): (
                <Toggle enabled={enabled} onClick={handleToggleClick} />)}
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
                                <tr key={index} className="bg-gray-100 mb-4">
                                    <td className="py-2 px-2 font-bold">{formatDate(playerStat.date)}</td>
                                    <td className="px-2 text-sm font-bold text-wOrange">{`${playerStat.away_team_abbr} VS ${playerStat.home_team_abbr}`}</td>
                                    <td className="px-2">{determineResult(playerStat)}</td>
                                    <td className="px-2">{playerStat.min ? parseFloat(playerStat.min.split(':')[0]) : '-'}</td>
                                    <td className="px-2">{playerStat.pts ?? '-'}</td>
                                    <td className="px-2">{playerStat.fgm ?? '-'}</td>
                                    <td className="px-2">{playerStat.fga ?? '-'}</td>
                                    <td className="px-2">{playerStat.fg3m ?? '-'}</td>
                                    <td className="px-2">{playerStat.fg3a ?? '-'}</td>
                                    <td className="px-2">{playerStat.ftm ?? '-'}</td>
                                    <td className="px-2">{playerStat.fta ?? '-'}</td>
                                    <td className="px-2">{playerStat.oreb ?? '-'}</td>
                                    <td className="px-2">{playerStat.dreb ?? '-'}</td>
                                    <td className="px-2">{playerStat.reb ?? '-'}</td>
                                    <td className="px-2">{playerStat.ast ?? '-'}</td>
                                    <td className="px-2">{playerStat.stl ?? '-'}</td>
                                    <td className="px-2">{playerStat.blk ?? '-'}</td>
                                    <td className="px-2">{playerStat.tos ?? '-'}</td>
                                    <td className="px-2">{playerStat.pf ?? '-'}</td>
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