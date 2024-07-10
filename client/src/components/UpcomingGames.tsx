import { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO, parse } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Game } from "../types/Game";

interface UpcomingGamesProps {
    games: Game[];
}

const UpcomingGames: React.FC<UpcomingGamesProps> = ({ games }) => {
    const [visibleGames, setVisibleGames] = useState<number>(3);

    const formatDate = (dateString: string): string => {
        const date = toZonedTime(parseISO(dateString), 'UTC');
        return format(date, 'EEEE, MMMM d');
    };

    const formatDateMobile = (dateString: string): { day: string, date: string, month: string } => {
        const date = toZonedTime(parseISO(dateString), 'UTC');
        const day = format(date, 'EEE');
        const datePart = format(date, 'd');
        const month = format(date, 'MMM');
        return { day, date: datePart, month };
    };

    const parseGameTime = (timeString: string): Date => {
        return parse(timeString, "h:mm a 'ET'", new Date());
    };

    const loadMoreGames = () => {
        setVisibleGames(prev => prev + 3);
    };

    const sortedGames = games
        .filter(game => game.status !== 'Final')
        .sort((a, b) => {
            const dateA = parseISO(a.date);
            const dateB = parseISO(b.date);

            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            } else {
                const timeA = a.status.includes("ET") ? parseGameTime(a.status).getTime() : 0;
                const timeB = b.status.includes("ET") ? parseGameTime(b.status).getTime() : 0;
                return timeA - timeB;
            }
        });

    return (
        <>
            <div className="lg:block hidden">
                <h1 className='font-bold text-4xl mt-10'>Upcoming</h1>
                <div className='flex flex-col gap-4 mt-5 mx-10'>
                    {sortedGames.slice(0, visibleGames).map((game, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className='flex items-center py-3 px-10 justify-between gap-4 bg-gray-100 rounded'
                        >
                            <div className='flex flex-col items-end w-1/4'>
                                <p className='text-wOrange font-bold'>{formatDate(game.date)}</p>
                                <p>{game.status}</p>
                            </div>
                            <div className='flex justify-between w-3/4 pl-4'>
                                <div className='flex gap-1'>
                                    <p className='font-bold'>{game.away_team_city + " " + game.away_team_name + " "}<span className="font-normal">at</span>{" " + game.home_team_city + " " + game.home_team_name}</p>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <p>{game.arena}</p>
                                    <p>{game.arena_city + ", " + game.arena_state}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {visibleGames < sortedGames.length && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='mt-4 p-2 border-2 border-wOrange text-wOrange rounded-3xl px-4 self-center hover:bg-wOrange hover:text-white'
                            onClick={loadMoreGames}
                        >
                            Load More
                        </motion.button>
                    )}
                </div>
            </div>

            <div className="display-block lg:hidden">
                <h1 className='font-bold text-2xl md:text-4xl mt-10 text-left'>Upcoming</h1>
                <div className='flex flex-col gap-4 mt-5'>
                    {sortedGames.slice(0, visibleGames).map((game, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className='flex items-center py-3 px-4 gap-4 bg-gray-100 rounded'
                        >
                            <div className='flex items-center gap-4 w-full'>
                                <div className='flex flex-col items-center justify-center bg-white min-w-fit p-2 rounded-lg md:px-4 w-24 md:w-36'>
                                    <p className='text-wOrange font-semibold text-xl md:text-2xl'>{formatDateMobile(game.date).day}<span className='text-gray-500'> {formatDateMobile(game.date).month}</span></p>
                                    <p className='text-4xl font-bold'>{formatDateMobile(game.date).date}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='font-bold'>{game.away_team_city + " " + game.away_team_name + " at " + game.home_team_city + " " + game.home_team_name}</p>
                                    <p>{game.status}</p>
                                    <p>{game.arena}</p>
                                    <p>{game.arena_city + ", " + game.arena_state}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {visibleGames < sortedGames.length && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='mt-4 p-2 border-2 border-wOrange text-wOrange rounded-3xl px-4 self-center hover:bg-wOrange hover:text-white'
                            onClick={loadMoreGames}
                        >
                            Load More
                        </motion.button>
                    )}
                </div>
            </div>
        </>
    );
};

export default UpcomingGames;