import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import teamsData from "../data/teams.json";

interface Team {
    name: string;
    wins: number;
    losses: number;
    logo: string;
    abbreviation: string;
    team_id: number;
    display_name: string;
}

function Standings() {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data: Team[] = teamsData;
                setTeams(data);
            } catch (error) {
                console.error("Error loading teams data:", error);
            }
        };

        fetchTeams();
    }, []);

    // Calculate win percentage and sort teams by it in descending order
    const sortedTeams = teams
        .map((team) => ({
            ...team,
            winPercentage: team.wins / (team.wins + team.losses),
        }))
        .sort((a, b) => b.winPercentage - a.winPercentage);

    return (
        <div className="flex flex-col gap-4 my-10">
            {sortedTeams.map((team, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-100 flex justify-between items-center rounded px-2 md:px-10">
                    <div className="flex items-center md:gap-4">
                        <div className="bg-wOrange text-white md:font-bold flex items-center justify-center rounded-3xl h-8 w-8 md:h-10 md:w-10">
                            {index + 1}
                        </div>
                        <img
                            className="w-16 md:w-24 p-4"
                            src={team.logo}
                            alt={`${team.display_name} logo`}
                        />
                        <p className="md:text-xl">{team.display_name}</p>
                    </div>
                    <div className="flex items-center">
                        <h2
                            className={`
                                p-2 rounded font-bold min-w-max
                                ${
                                    team.winPercentage >= 0.6
                                        ? "bg-green-300"
                                        : ""
                                }
                                ${
                                    team.winPercentage >= 0.4 &&
                                    team.winPercentage < 0.6
                                        ? "bg-yellow-300"
                                        : ""
                                }
                                ${team.winPercentage < 0.4 ? "bg-red-300" : ""}
                            `}>
                            {team.wins} - {team.losses}
                        </h2>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default Standings;
