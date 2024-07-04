import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teams`);
                const data: Team[] = await response.json();
                setTeams(data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };

        fetchTeams();
    }, []);

    // Sort teams by wins in descending order and then by losses in ascending order
    const sortedTeams = teams.sort((a, b) => {
        if (a.wins === b.wins) {
            return a.losses - b.losses;
        }
        return b.wins - a.wins;
    });

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
                        <img className="w-16 md:w-24 p-4" src={team.logo} alt={`${team.display_name} logo`} />
                        <p className="md:text-xl">{team.display_name}</p>
                    </div>
                    <div className="flex items-center">
                        <h2
                            className={`
                                p-2 rounded font-bold min-w-max
                                ${team.wins >= team.losses + 2 ? 'bg-green-300' : ''}
                                ${Math.abs(team.wins - team.losses) <= 1 ? 'bg-yellow-300' : ''}
                                ${team.losses >= team.wins + 2 ? 'bg-red-300' : ''}
                            `}
                        >
                            {team.wins} - {team.losses}
                        </h2>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default Standings;