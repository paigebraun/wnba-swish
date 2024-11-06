import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Toggle from "./Toggle";
import Glossary from "./Glossary";
import teamStatsData from "../data/team_stats.json";

import "../spinner.css";

interface Stat {
    stat_type: string;
    stat_abbr: string;
    value: number;
}

const TeamInfo: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const [stats, setStats] = useState<Stat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enabled, setEnabled] = useState(false); // State for toggle

    const location = useLocation();
    const savedTeamData = localStorage.getItem("teamData");
    const { logo, name, wins, losses } =
        location.state || (savedTeamData && JSON.parse(savedTeamData)) || {};

    useEffect(() => {
        const fetchTeamStats = () => {
            try {
                const filteredStats = teamStatsData.filter(
                    (stat) => stat.team_id.toString() === teamId
                );

                if (filteredStats.length === 0) {
                    throw new Error("No stats found for this team");
                }

                setStats(filteredStats);
            } catch (error) {
                console.error("Error loading team stats:", error);
                setError("Error loading team stats");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeamStats();
    }, [teamId]);

    const handleToggleClick = () => {
        setEnabled(!enabled);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return <p>{error}</p>;
    }

    function formatNum(num: number) {
        return Math.round(num * 100) / 100;
    }

    const winPercentage = wins + losses > 0 ? wins / (wins + losses) : 0;

    return (
        <>
            <div className="flex flex-col md:flex-row w-full gap-5 mt-10">
                <div className="hidden md:flex bg-gray-100 rounded h-fit max-w-20 md:max-w-60">
                    <img src={logo} alt="Team Logo" className="" />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex flex-wrap gap-2 md:items-center h-fit mb-4">
                        <div className="flex md:hidden bg-gray-100 rounded h-fit max-w-28 md:max-w-60">
                            <img src={logo} alt="Team Logo" className="" />
                        </div>
                        <div className="flex md:flex-row flex-col md:items-center">
                            <h1 className="font-bold text-2xl md:text-4xl mr-4 md:mr-10">
                                {name}
                            </h1>
                            <Toggle
                                enabled={enabled}
                                onClick={handleToggleClick}
                            />
                        </div>
                    </div>
                    {enabled && (
                        <div className="mb-4">
                            <Glossary page="team-info" />
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <div className="flex flex-col gap-2 md:gap-4">
                            <h2
                                className={`
                  px-4 py-2 rounded font-bold text-center whitespace-nowrap
                  ${winPercentage >= 0.6 ? "bg-green-300" : ""}
                  ${
                      winPercentage >= 0.4 && winPercentage < 0.6
                          ? "bg-yellow-300"
                          : ""
                  }
                  ${winPercentage < 0.4 ? "bg-red-300" : ""}
                `}>
                                {wins} - {losses}
                            </h2>
                            <div className="flex justify-center items-center flex-col bg-gray-100 rounded h-full">
                                {stats[0]?.stat_abbr}
                                <div className="font-bold text-2xl">
                                    {formatNum(stats[0]?.value)}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {stats.slice(1).map((stat, index) => (
                                <div
                                    className="flex items-center flex-col bg-gray-100 rounded px-4 py-2"
                                    key={index}>
                                    {stat.stat_abbr}
                                    <div className="font-bold md:text-xl lg:text-2xl">
                                        {formatNum(stat.value)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamInfo;
