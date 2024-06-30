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
      <div className="flex flex-col md:flex-row w-full gap-5 mt-10">
        <div className="hidden md:flex bg-gray-100 rounded h-fit max-w-20 md:max-w-60">
          <img src={logo} alt="Team Logo" className="" />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap gap-2 md:items-center h-fit mb-4">
            <div className="flex md:hidden bg-gray-100 rounded h-fit max-w-28 md:max-w-60">
              <img src={logo} alt="Team Logo" className="" />
            </div>
            <div className="flex md:flex-row flex-col md:items-center">
              <h1 className="font-bold text-2xl md:text-4xl mr-4 md:mr-10">{name}</h1>
              <Toggle enabled={enabled} onClick={handleToggleClick} />
            </div>
          </div>
          {enabled && (
            <div className="mb-4">
              <Glossary page="team-info" />
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <div className="flex flex-col gap-2 md:gap-4">
              <h2
                className={`
                  px-4 py-2 rounded font-bold text-center whitespace-nowrap
                  ${wins >= losses + 2 ? "bg-green-300" : ""}
                  ${Math.abs(wins - losses) <= 1 ? "bg-yellow-300" : ""}
                  ${losses >= wins + 2 ? "bg-red-300" : ""}
                `}
              >
                {wins} - {losses}
              </h2>
              <div className="flex justify-center items-center flex-col bg-gray-100 rounded h-full">
                {stats[0]?.stat_abbr}
                <div className="font-bold text-2xl">{formatNum(stats[0]?.value)}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {stats.slice(1).map((stat, index) => (
                <div className="flex items-center flex-col bg-gray-100 rounded px-4 py-2" key={index}>
                  {stat.stat_abbr}
                  <div className="font-bold md:text-xl lg:text-2xl">{formatNum(stat.value)}</div>
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