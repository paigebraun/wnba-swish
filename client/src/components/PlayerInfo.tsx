import { useParams, useLocation } from "react-router-dom";
import { toZonedTime } from 'date-fns-tz';

function PlayerInfo() {
    const { playerId } = useParams<{ playerId: string }>();

    const location = useLocation();
    const { dob, height, weight, pos, prior, exp, name, number, teamLogo } = location.state as { dob: string, height: string, weight: string, pos: string, prior: string, exp: string, name: string, number: number, teamLogo: string};

    function formatDateString(dateStr: string): string {
        const dateObj: Date = new Date(dateStr);
        const zonedDate = toZonedTime(dateObj, 'UTC'); // Convert to UTC
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate: string = zonedDate.toLocaleDateString('en-US', options);
    
        return formattedDate;
    }
    
    return (
        <div className="flex w-full relative gap-4 md:gap-10 mt-10 md:flex-row flex-col">
            <h1 className="font-bold text-2xl md:hidden md:text-4xl mr-10">{name}</h1>
            <div className="flex bg-gray-100 rounded h-fit md:max-w-60">
                <img className="pt-4" src={`https://cdn.wnba.com/headshots/wnba/latest/1040x760/${playerId}.png`} alt="Profile Pic" />
            </div>
            <div className="flex flex-col w-full">
                <h1 className="font-bold hidden md:block md:text-4xl mr-10">{name}</h1>
                <div className="grid grid-cols-2 gap-2 gap-x-10 mt-2 w-fit">
                    <div className="flex flex-col">
                        <p className="text-xs">HEIGHT</p>
                        <p className="text-lg md:text-2xl font-bold">{height}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs">WEIGHT</p>
                        <p className="text-lg md:text-2xl font-bold">{weight !== null ? weight : '--'}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs">BIRTHDATE</p>
                        <p className="text-lg md:text-2xl font-bold">{formatDateString(dob)}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs">PRIOR</p>
                        <p className="text-lg md:text-2xl font-bold">{prior}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs">POS</p>
                        <p className="text-lg md:text-2xl font-bold">{pos}</p>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xs">EXP</p>
                        <p className="text-lg md:text-2xl font-bold">{exp}</p>
                    </div>
                </div>
            </div>
            <div className="flex absolute right-0 gap-2 top-12 md:top-0">
                <div className="bg-gray-100 rounded">
                    <p className="text-4xl font-black text-wOrange p-2">{number}</p>
                </div>
                <div className="bg-gray-100 ronded max-w-14">
                    <img className="p-2" src={teamLogo} alt="Team Logo" />
                </div>
            </div>
        </div>
    )
}

export default PlayerInfo;