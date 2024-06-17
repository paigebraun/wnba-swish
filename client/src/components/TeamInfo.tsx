import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Toggle from "./Toggle";
import Glossary from "./Glossary";

interface Stat {
  stat_type: string;
  stat_abbr: string;
  value: number;
}

const TeamInfo: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false); // State for toggle

  const location = useLocation();
  const { logo, name, wins, losses } = location.state as { logo: string, name: string, wins: number, losses: number };

  useEffect(() => {
    const fetchTeamStats = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/team-stats/${teamId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch team stats");
        }
        const data: Stat[] = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching team stats:", error);
        setError("Error fetching team stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamStats();
  }, [teamId]);

  const handleToggleClick = () => {
    setEnabled(!enabled);
  };

  if (isLoading) {
    return <p>Loading stats...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  function formatNum(num: number) {
    return Math.round(num * 100) / 100;
  }

  return (
    <>
      <div className="flex w-full gap-10 mt-10">
        <div className="flex bg-gray-100 rounded h-fit max-w-48">
          <img src={logo} alt="Team Logo" />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap items-center h-fit mb-4">
            <h2 className="font-bold text-4xl mr-10">{name}</h2>
            <Toggle enabled={enabled} onClick={handleToggleClick} />
          </div>
          {enabled && (
            <div className="mb-4">
              <Glossary />
            </div>
          )}
          <div className='flex gap-4'>
          <div className='flex flex-col gap-4'>
            <h2
                className={`
                    px-4 py-2 rounded font-bold
                    ${wins >= losses + 2 ? 'bg-green-300' : ''}
                    ${Math.abs(wins - losses) <= 1 ? 'bg-yellow-300' : ''}
                    ${losses >= wins + 2 ? 'bg-red-300' : ''}
                    `}
                >
                    {wins} - {losses}
            </h2>
            <div className="flex justify-center items-center flex-col bg-gray-100 rounded h-full">
                {stats[0].stat_abbr}
                <div className="font-bold text-2xl">{formatNum(stats[0].value)}</div>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {stats.slice(1).map((stat, index) => (
              <div className="flex items-center flex-col bg-gray-100 rounded px-4" key={index}>
                {stat.stat_abbr}
                <div className="font-bold text-2xl">{formatNum(stat.value)}</div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamInfo;