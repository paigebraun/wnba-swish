import { useEffect, useState } from "react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

SwiperCore.use([Navigation]);

interface Team {
    name: string;
    wins: number;
    losses: number;
    logo: string;
    abbreviation: string;
}

function TeamCards() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentIndex, setCurrentIndex] = useState(2);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch teams from DB
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/teams");
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
        return <p>Loading teams...</p>;
    }

    // Function to get the circular index
    const getCircularIndex = (index: number) => {
        if (index < 0) {
            return (teams.length + (index % teams.length)) % teams.length;
        }
        return index % teams.length;
    };

    // Calculate the transform style based on the circular index
    const calculateTransformStyle = (index: number) => {
        const circularIndex = getCircularIndex(index);
        const circularCurrentIndex = getCircularIndex(currentIndex);

        // Calculate the shortest distance in the circular array
        const distanceFromCenter = Math.min(
            Math.abs(circularCurrentIndex - circularIndex),
            teams.length - Math.abs(circularCurrentIndex - circularIndex)
        );

        // Determine the direction of rotation based on position relative to center
        let isRightSide = false;
        if (circularCurrentIndex < circularIndex) {
            isRightSide = circularIndex - circularCurrentIndex <= teams.length / 2;
        } else {
            isRightSide = circularCurrentIndex - circularIndex > teams.length / 2;
        }

        // Adjust the translation and rotation
        const maxTranslateDistance = 20;
        const maxRotateAngle = 10;

        let translateY = 0;
        let rotateY = 0;
        let translateX = 0;

        // Translate and rotate the immediate neighbors
        if (distanceFromCenter === 1) {
            translateY = maxTranslateDistance;
            translateX = isRightSide ? maxTranslateDistance : -maxTranslateDistance; 
            rotateY = isRightSide ? maxRotateAngle * 1.5 : -maxRotateAngle * 1.5; 
        } else if (distanceFromCenter === 2) {
            translateY = maxTranslateDistance * 4.5;
            translateX = isRightSide ? maxTranslateDistance : -maxTranslateDistance; 
            rotateY = isRightSide ? maxRotateAngle * 2.5 : -maxRotateAngle * 2.5;
        } else if (distanceFromCenter === 3) {
            translateY = maxTranslateDistance * 9.5;
            translateX = isRightSide ? maxTranslateDistance : -maxTranslateDistance; 
            rotateY = isRightSide ? maxRotateAngle * 3 : -maxRotateAngle * 3;
        }

        return distanceFromCenter <= 3 ? `translateY(${translateY}px) rotate(${rotateY}deg) translateX(${translateX}px)` : 'none';
    };

    // Function to determine if team is Eastern or Western Conference
    function getConference(teamAbbr: string) {
        const westernTeams = ['DAL', 'LV', 'LA', 'MIN', 'PHX', 'SEA'];
        return westernTeams.includes(teamAbbr) ? 'Western Conference' : 'Eastern Conference';
    }

    return (
        <div className="h-[80vh] flex justify-center items-center">
            <div className="w-full max-w-screen-lg">
                <Swiper
                    spaceBetween={0}
                    slidesPerView={5}
                    centeredSlides={true}
                    navigation={{ prevEl: ".swiper-button-prev", nextEl: ".swiper-button-next" }}
                    onSlideChange={(swiper) => setCurrentIndex(getCircularIndex(swiper.realIndex))}
                    loop={true}
                    className="mySwiper overflow-visible"
                    initialSlide={2}
                >
                    {teams.map((team, index) => {
                        const circularIndex = getCircularIndex(index);
                        const transformStyle = calculateTransformStyle(index);

                        return (
                            <SwiperSlide key={index} className="rounded-lg p-2">
                                <div className={`flex justify-center p-4 rounded-lg transition-all ${currentIndex === circularIndex ? 'bg-wOrange' : 'bg-gray-100'}`} style={{ transform: transformStyle }}>
                                    <img src={team.logo} alt={team.name} className="object-cover" />
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
                <div className="flex items-center justify-center mt-10 gap-6">
                    <button className="flex justify-center items-center w-7 h-7 rounded-full bg-wOrange text-white swiper-button-prev"><FaArrowLeft /></button>
                    <div className="flex flex-col items-center min-w-48">
                        {teams.length > 0 && <h2 className="font-bold text-xl">{teams[getCircularIndex(currentIndex)].name}</h2>}
                        {teams.length > 0 && <h2>{getConference(teams[getCircularIndex(currentIndex)].abbreviation)}</h2>}
                        {teams.length > 0 && <h2 className="bg-green-300 mt-6 px-4 py-2 rounded font-bold">{teams[getCircularIndex(currentIndex)].wins} - {teams[getCircularIndex(currentIndex)].losses}</h2>}
                    </div>
                    <button className="flex justify-center items-center w-7 h-7 rounded-full bg-wOrange text-white swiper-button-next"><FaArrowRight /></button>
                </div>
            </div>
        </div>
    );
}

export default TeamCards;