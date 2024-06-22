import { useState } from "react";
import { Game } from "../types/Game";

interface PreviousGamesProps {
    games: Game[];
    teamId: string;
}

const UpcomingGames: React.FC<PreviousGamesProps> = ({ games, teamId }) => {
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
        <h1 className='font-bold text-4xl mt-10'>Previous</h1>
        <div className='flex flex-col gap-4 mt-5 mx-10 mb-10'>
            {games.filter(game => game.status === 'Final')
                  .sort((a, b) => {
                      const dateA = new Date(a.date).getTime(); 
                      const dateB = new Date(b.date).getTime();
                      return dateB - dateA;
                  })
                  .slice(0, visibleGames)
                  .map((game, index) => {
                    const teamIdNumber = Number(teamId);
                    const isHomeTeam = game.home_team_id === teamIdNumber;
                    const homeScore = Number(game.home_score);
                    const awayScore = Number(game.away_score);

                    const isWin = (isHomeTeam && homeScore > awayScore) ||
                                  (!isHomeTeam && awayScore > homeScore);
                      
                      return (
                          <div key={index} className='flex items-center py-3 px-10 gap-4 justify-between bg-wOrange text-white rounded'>
                           
                              <div className='flex flex-col items-end w-1/4'>
                                  <p className='font-bold'>{formatDate(game.date)}</p>
                                  {isWin ? (
                                      <p>W</p>
                                  ) : (
                                      <p>L</p>
                                  )}
                              </div>
                      
                              <div className='flex justify-between w-3/4 pl-4'>
                                  <div className='flex justify-between w-1/2'>
                                    <div className='flex flex-col'>
                                        <p className='font-bold'>{game.away_team_city + " " + game.away_team_name}</p>
                                        <p className='font-bold'>{game.home_team_city + " " + game.home_team_name}</p>
                                    </div>
                                
                                    <div className='flex flex-col items-end font-bold'>
                                        <p>{game.away_score}</p>
                                        <p>{game.home_score}</p>
                                    </div>
                                  </div>
                          
                                  <div className='flex flex-col items-end'>
                                      <p>{game.arena}</p>
                                      <p>{game.arena_city + ", " + game.arena_state}</p>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
            {visibleGames < games.filter(game => game.status === 'Final').length && (
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