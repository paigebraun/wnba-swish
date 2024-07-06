import { useState } from "react";
import { Game } from "../types/Game";
import { motion } from "framer-motion";
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface PreviousGamesProps {
    games: Game[];
    teamId?: string;
}

const PreviousGames: React.FC<PreviousGamesProps> = ({ games, teamId }) => {
    const [visibleGames, setVisibleGames] = useState<number>(3);

    const formatDate = (dateString: string): string => {
        const date = toZonedTime(parseISO(dateString), 'UTC');
        return format(date, 'EEEE, MMMM d');
    };
    
    const formatDateMobile = (dateString: string): { day: string, date: string, month: string} => {
        const date = toZonedTime(parseISO(dateString), 'UTC');
        const day = format(date, 'EEE');
        const datePart = format(date, 'd');
        const month = format(date, 'MMM');
        return { day, date: datePart, month };
    };

    const loadMoreGames = () => {
        setVisibleGames(prev => prev + 3);
    };

    return (
        <>
            <div className="hidden lg:block">
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

                              const isWin = teamId
                                  ? (isHomeTeam && homeScore > awayScore) ||
                                    (!isHomeTeam && awayScore > homeScore)
                                  : null;

                              return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className='flex items-center py-3 px-4 gap-4 bg-wOrange text-white rounded'
                                >
                                      <div className='flex flex-col items-end w-1/4'>
                                          <p className='font-bold'>{formatDate(game.date)}</p>
                                          {teamId && (
                                              isWin ? (
                                                  <p>W</p>
                                              ) : (
                                                  <p>L</p>
                                              )
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
                                  </motion.div>
                              );
                          })}
                    {visibleGames < games.filter(game => game.status === 'Final').length && (
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
            
            <div className="block lg:hidden">
                <h1 className='font-bold text-2xl md:text-4xl mt-10 text-left'>Previous</h1>
                <div className='flex flex-col gap-4 mt-5 mb-10'>
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

                              const isWin = teamId
                                  ? (isHomeTeam && homeScore > awayScore) ||
                                    (!isHomeTeam && awayScore > homeScore)
                                  : null;

                              return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className='flex items-center py-3 px-4 gap-4 bg-wOrange text-white rounded'
                                >
                                      <div className='flex items-center gap-4 w-full'>
                                          <div className='flex flex-col items-center justify-center bg-white p-2 rounded-lg px-4 w-1/3 md:w-1/5'>
                                            <p className='text-wOrange font-semibold text-xl md:text-2xl'>{formatDateMobile(game.date).day}<span className='text-gray-500'> {formatDateMobile(game.date).month}</span></p>
                                            <p className='text-4xl text-black font-bold'>{formatDateMobile(game.date).date}</p>
                                          </div>
                                          <div className='flex flex-col'>
                                              <p className='font-bold'>{game.away_team_city + " " + game.away_team_name + " at " + game.home_team_city + " " + game.home_team_name}</p>
                                              {teamId && (
                                                  isWin ? (
                                                      <p>{awayScore} - {homeScore} (W)</p>
                                                  ) : (
                                                      <p>{awayScore} - {homeScore} (L)</p>
                                                  )
                                              )}
                                              <p>Final: {awayScore} - {homeScore}</p>
                                              <p>{game.arena}</p>
                                              <p>{game.arena_city + ", " + game.arena_state}</p>
                                          </div>
                                      </div>
                                  </motion.div>
                              );
                          })}
                    {visibleGames < games.filter(game => game.status === 'Final').length && (
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
}

export default PreviousGames;