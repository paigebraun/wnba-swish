interface GlossaryProps {
    page: string;
}

function Glossary({page}: GlossaryProps) {
    return(
        <div className='grid grid-cols-3 text-xs'>
            {page === 'team-info' ? (
                <>
                    <p><span className="font-bold">GP</span> - Games Played</p>
                    <p><span className="font-bold">PPG</span> - Points Per Game</p>
                    <p><span className="font-bold">RPG</span> - Rebounds Per Game</p>
                    <p><span className="font-bold">APG</span> - Assists Per Game</p>
                    <p><span className="font-bold">SPG</span> - Steals Per Game</p>
                    <p><span className="font-bold">BPG</span> - Blocks Per Game</p>
                    <p><span className="font-bold">FG%</span> - Field Goal Percentage</p>
                    <p><span className="font-bold">3P%</span> - 3 Point Field Goals Percentage</p>
                    <p><span className="font-bold">FT%</span> - Free Throw Percentage</p>
                    <p><span className="font-bold">TO</span> - Turnovers</p>
                    <p><span className="font-bold">PF</span> - Personal Fouls</p>
                </>
            ) : (
                <>
                    <p><span className="font-bold">MIN</span> - Minutes Played</p>
                    <p><span className="font-bold">PTS</span> - Points Scored</p>
                    <p><span className="font-bold">FGM</span> - Field Goals Made</p>
                    <p><span className="font-bold">FGA</span> - Field Goals Attempted</p>
                    <p><span className="font-bold">FGM-3</span> - Three-Point Field Goals Made</p>
                    <p><span className="font-bold">FGA-3</span> - Three-Point Field Goals Attempted</p>
                    <p><span className="font-bold">FTM</span> - Free Throws Made</p>
                    <p><span className="font-bold">FTA</span> - Free Throws Attempted</p>
                    <p><span className="font-bold">OREB</span> - Offensive Rebounds</p>
                    <p><span className="font-bold">DREB</span> - Defensive Rebounds</p>
                    <p><span className="font-bold">REB</span> - Total Rebounds</p>
                    <p><span className="font-bold">AST</span> - Assists</p>
                    <p><span className="font-bold">STL</span> - Steals</p>
                    <p><span className="font-bold">BLK</span> - Blocks</p>
                    <p><span className="font-bold">TO</span> - Turnovers</p>
                    <p><span className="font-bold">PF</span> - Personal Fouls</p>
                </>
            )}
        </div>
    );
}

export default Glossary;