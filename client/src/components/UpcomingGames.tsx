import { useState } from "react";
import { Game } from "../types/Game";

interface UpcomingGamesProps {
    games: Game[];
}

const UpcomingGames: React.FC<UpcomingGamesProps> = ({ games }) => {
    const [visibleGames, setVisibleGames] = useState<number>(3);

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatDateMobile = (dateString: string): { day: string, date: string } => {
        const date = new Date(dateString);
        const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'short' };
        const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric' };
        const day = date.toLocaleDateString(undefined, dayOptions);
        const datePart = date.toLocaleDateString(undefined, dateOptions);
        return { day, date: datePart };
    };

    const loadMoreGames = () => {
        setVisibleGames(prev => prev + 3);
    };

    return (
        <>
        <div className="lg:block hidden">
            <h1 className='font-bold text-4xl mt-10'>Schedule</h1>
            <div className='flex flex-col gap-4 mt-5 mx-10'>
                {games.filter(game => game.status !== 'Final').slice(0, visibleGames).map((game, index) => (
                    <div key={index} className='flex items-center py-3 px-10 justify-between gap-4 bg-gray-100 rounded'>
                
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
                    </div>
                ))}
                {visibleGames < games.filter(game => game.status !== 'Final').length && (
                    <button 
                        className='mt-4 p-2 border-2 border-wOrange text-wOrange rounded-3xl px-4 self-center hover:bg-wOrange hover:text-white' 
                        onClick={loadMoreGames}
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>

        <div className="display-block lg:hidden">
        <h1 className='font-bold text-2xl md:text-4xl mt-10 text-left'>Schedule</h1>
            <div className='flex flex-col gap-4 mt-5'>
                {games.filter(game => game.status !== 'Final').slice(0, visibleGames).map((game, index) => (
                    <div key={index} className='flex items-center py-3 px-4 gap-4 bg-gray-100 rounded'>
                        <div className='flex items-center gap-4 w-full'>
                            <div className='flex flex-col items-center justify-center bg-white p-2 rounded-lg px-4 w-1/3 md:w-1/5'>
                                <p className='text-wOrange font-bold text-xl md:text-2xl'>{formatDateMobile(game.date).day}</p>
                                <p className='text-4xl font-bold'>{formatDateMobile(game.date).date}</p>
                            </div>
                            <div className='flex flex-col'>
                                <p className='font-bold'>{game.away_team_city + " " + game.away_team_name + " at " + game.home_team_city + " " + game.home_team_name}</p>
                                <p>{game.date.split('T')[1].slice(1, 5)} ET</p>
                                <p>{game.arena}</p>
                                <p>{game.arena_city + ", " + game.arena_state}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {visibleGames < games.filter(game => game.status !== 'Final').length && (
                    <button 
                        className='mt-4 p-2 border-2 border-wOrange text-wOrange rounded-3xl px-4 self-center hover:bg-wOrange hover:text-white' 
                        onClick={loadMoreGames}
                    >
                        Load More
                    </button>
                )}
            </div>
           </div>
        </>
    );
}

export default UpcomingGames;