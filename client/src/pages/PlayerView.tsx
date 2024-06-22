import NavBar from "../components/NavBar";
import PlayerInfo from "../components/PlayerInfo";
import RecentStats from "../components/RecentStats";

function PlayerView() {
    return (
        <>
            <NavBar />
            <div className='mx-10'>
                <PlayerInfo />
                <RecentStats />
            </div>
        </>
    )
}


export default PlayerView;