import PlayerInfo from "../components/PlayerInfo";
import RecentStats from "../components/RecentStats";
import PlayerShots from "../components/PlayerShots";

function PlayerView() {
    return (
        <>
            <div className='mx-2 md:mx-10'>
                <PlayerInfo />
                <RecentStats />
                <PlayerShots />
            </div>
        </>
    )
}


export default PlayerView;