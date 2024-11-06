import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import playersData from "../data/players.json";

const TeamPlayers: React.FC = () => {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();

    interface Player {
        first_name: string;
        last_name: string;
        pos: string;
        number: number;
        exp: number;
        hcc: string;
        player_id: string | number;
        height: string;
        weight: string | number;
        dob: string;
    }

    const [players, setPlayers] = useState<Player[]>([]);

    const location = useLocation();
    const savedState = localStorage.getItem("teamData");
    const { logo } =
        location.state || (savedState && JSON.parse(savedState)) || "";

    useEffect(() => {
        const fetchPlayers = () => {
            try {
                const teamPlayers = playersData.filter(
                    (player) => player.team_id.toString() === teamId
                );

                if (teamPlayers.length === 0) {
                    throw new Error("No players found for this team");
                }

                setPlayers(teamPlayers);
            } catch (error) {
                console.error("Error loading players:", error);
            }
        };

        fetchPlayers();
    }, [teamId]);

    return (
        <>
            <h1 className="font-bold text-2xl md:text-4xl mt-10">Players</h1>
            <div className="relative mx-2 md:mx-10">
                <div className="overflow-x-auto md:overflow-visible">
                    <table className="min-w-full bg-white border-collapse mt-5">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="text-left py-2 px-4">NAME</th>
                                <th className="text-right py-2 px-4">NUM</th>
                                <th className="text-right py-2 px-4">POS</th>
                                <th className="text-right py-2 px-4">EXP</th>
                                <th className="text-right py-2 px-4">FROM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, index) => (
                                <tr
                                    key={index}
                                    className="group relative hover:border-t-2 hover:border-b-2 border-gray-200 hover:font-bold hover:text-xl cursor-pointer"
                                    onClick={() =>
                                        navigate(
                                            `/player/${player.player_id}`,
                                            {
                                                state: {
                                                    dob: player.dob,
                                                    height: player.height,
                                                    weight: player.weight,
                                                    prior: player.hcc,
                                                    pos: player.pos,
                                                    exp: player.exp,
                                                    name:
                                                        player.first_name +
                                                        " " +
                                                        player.last_name,
                                                    number: player.number,
                                                    teamLogo: logo,
                                                    teamId: teamId,
                                                },
                                            }
                                        )
                                    }>
                                    <td className="py-2 pr-4 w-1/3">
                                        {player.first_name} {player.last_name}
                                        <div className="hidden absolute left-[-50px] top-1/2 transform -translate-y-1/2 bg-wOrange pl-5 pr-2 py-1 rounded-2xl text-white md:group-hover:block">
                                            <FaArrowRight />
                                        </div>
                                    </td>
                                    <td className="text-right py-2">
                                        {player.number}
                                    </td>
                                    <td className="text-right py-2">
                                        {player.pos}
                                    </td>
                                    <td className="text-right py-2">
                                        {player.exp}
                                    </td>
                                    <td className="text-right py-2 pl-4 w-1/3">
                                        {player.hcc}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TeamPlayers;
