import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SwiperCore from 'swiper/core';
import { Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import '../spinner.css';
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
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teams`);
                const data: Team[] = await response.json();
                setTeams(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching teams:", error);
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
        const westernTeams = ['DAL', 'LV', 'LA', 'MIN', 'PHX', 'SEA'];
        return westernTeams.includes(teamAbbr) ? 'Western Conference' : 'Eastern Conference';
    }

    return (
        <div className="md:h-[80vh] flex justify-center items-center overflow-hidden mb-10">
            <div className="w-full max-w-screen-lg">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                    }}
                    grabCursor={true}
                    centeredSlides={true}
                    navigation={{ prevEl: ".swiper-button-prev", nextEl: ".swiper-button-next" }}
                    onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                    loop={true}
                    className="mySwiper overflow-visible"
                    initialSlide={2}
                >
                    {teams.map((team, index) => (
                        <SwiperSlide key={index} className="rounded-lg p-2">
                            <div
                                className={`flex justify-center p-4 rounded-lg transition-all ${
                                    currentIndex === index ? 'bg-wOrange' : 'bg-gray-100'
                                }`}
                                onClick={() =>
                                    navigate(`/team/${team.team_id}`, {
                                        state: {
                                            logo: team.logo,
                                            name: team.display_name,
                                            wins: team.wins,
                                            losses: team.losses,
                                        },
                                    })
                                }
                            >
                                <img src={team.logo} alt={team.name} className="object-cover" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="flex items-center justify-center mt-10 gap-6">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex justify-center items-center w-7 h-7 rounded-full bg-wOrange text-white swiper-button-prev">
                        <FaArrowLeft />
                    </motion.button>
                    <div className="flex flex-col items-center min-w-48">
                        {teams.length > 0 && <h2 className="font-bold text-xl">{teams[currentIndex].name}</h2>}
                        {teams.length > 0 && <h2>{getConference(teams[currentIndex].abbreviation)}</h2>}
                        {teams.length > 0 && (
                            <h2
                                className={`
                                    mt-6 px-4 py-2 rounded font-bold
                                    ${teams[currentIndex].wins >= teams[currentIndex].losses + 2 ? 'bg-green-300' : ''}
                                    ${Math.abs(teams[currentIndex].wins - teams[currentIndex].losses) <= 1 ? 'bg-yellow-300' : ''}
                                    ${teams[currentIndex].losses >= teams[currentIndex].wins + 2 ? 'bg-red-300' : ''}
                                `}
                            >
                                {teams[currentIndex].wins} - {teams[currentIndex].losses}
                            </h2>
                        )}
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex justify-center items-center w-7 h-7 rounded-full bg-wOrange text-white swiper-button-next">
                        <FaArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

export default TeamCards;