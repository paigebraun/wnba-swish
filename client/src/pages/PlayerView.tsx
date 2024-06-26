import NavBar from "../components/NavBar";
import PlayerInfo from "../components/PlayerInfo";
import RecentStats from "../components/RecentStats";
import PlayerShots from "../components/PlayerShots";

function PlayerView() {
    return (
        <>
            <NavBar />
            <div className='mx-10'>
                <PlayerInfo />
                <RecentStats />
                <PlayerShots />
            </div>
        </>
    )
}


export default PlayerView;