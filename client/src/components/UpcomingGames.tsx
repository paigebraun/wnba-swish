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

    const loadMoreGames = () => {
        setVisibleGames(prev => prev + 3);
    };

    return (
        <>
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
        </>
    );
}

export default UpcomingGames;