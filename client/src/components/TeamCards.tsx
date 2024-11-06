import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import teamsData from "../data/teams.json";

import "../spinner.css";
import { motion } from "framer-motion";

SwiperCore.use([Navigation]);

interface Team {
    name: string;
    wins: number;
    losses: number;
    logo: string;
    abbreviation: string;
    team_id: number;
    display_name: string;
}

function TeamCards() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentIndex, setCurrentIndex] = useState(2);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data: Team[] = teamsData;
                setTeams(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading teams data:", error);
                setIsLoading(false);
            }
        };

        fetchTeams();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    function getConference(teamAbbr: string) {
        const westernTeams = ["DAL", "LV", "LA", "MIN", "PHX", "SEA"];
        return westernTeams.includes(teamAbbr)
            ? "Western Conference"
            : "Eastern Conference";
    }

    // Add winPercentage to each team object
    const teamsPCT = teams.map((team) => ({
        ...team,
        winPercentage: team.wins / (team.wins + team.losses),
    }));

    return (
        <div className="h-[80vh] flex justify-center items-center overflow-hidden mt-10 mb-10">
            <div className="w-full">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    breakpoints={{
                        500: { slidesPerView: 3 },
                        1224: { slidesPerView: 5 },
                        1500: { slidesPerView: 8 },
                    }}
                    grabCursor={true}
                    centeredSlides={true}
                    navigation={{
                        prevEl: ".swiper-button-prev",
                        nextEl: ".swiper-button-next",
                    }}
                    onSlideChange={(swiper) =>
                        setCurrentIndex(swiper.realIndex)
                    }
                    loop={true}
                    className="mySwiper overflow-visible"
                    initialSlide={2}>
                    {teamsPCT.map((team, index) => (
                        <SwiperSlide key={index} className="rounded-lg p-2">
                            <div
                                className={`flex justify-center p-4 rounded-lg transition-all ${
                                    currentIndex === index
                                        ? "bg-wOrange"
                                        : "bg-gray-100"
                                }`}
                                onClick={() => {
                                    const teamData = {
                                        logo: team.logo,
                                        name: team.display_name,
                                        wins: team.wins,
                                        losses: team.losses,
                                    };
                                    localStorage.setItem(
                                        "teamData",
                                        JSON.stringify(teamData)
                                    );
                                    navigate(`/team/${team.team_id}`);
                                }}>
                                <img
                                    src={team.logo}
                                    alt={team.name}
                                    className="object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="flex items-center justify-center mt-10 gap-6">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex justify-center items-center w-7 h-7 rounded-full bg-wOrange text-white swiper-button-prev">
                        <FaArrowLeft />
                    </motion.button>
                    <div className="flex flex-col items-center min-w-48">
                        {teamsPCT.length > 0 && (
                            <h2 className="font-bold text-xl">
                                {teamsPCT[currentIndex].display_name}
                            </h2>
                        )}
                        {teamsPCT.length > 0 && (
                            <h2>
                                {getConference(
                                    teamsPCT[currentIndex].abbreviation
                                )}
                            </h2>
                        )}
                        {teamsPCT.length > 0 && (
                            <h2
                                className={`
                                    mt-6 px-4 py-2 rounded font-bold
                                    ${
                                        teamsPCT[currentIndex].winPercentage >=
                                        0.6
                                            ? "bg-green-300"
                                            : ""
                                    }
                                    ${
                                        teamsPCT[currentIndex].winPercentage >=
                                            0.4 &&
                                        teamsPCT[currentIndex].winPercentage <
                                            0.6
                                            ? "bg-yellow-300"
                                            : ""
                                    }
                                    ${
                                        teamsPCT[currentIndex].winPercentage <
                                        0.4
                                            ? "bg-red-300"
                                            : ""
                                    }
                                `}>
                                {teamsPCT[currentIndex].wins} -{" "}
                                {teamsPCT[currentIndex].losses}
                            </h2>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex justify-center items-center w-7 h-7 rounded-full bg-wOrange text-white swiper-button-next">
                        <FaArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default TeamCards;
