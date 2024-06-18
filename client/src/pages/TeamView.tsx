import TeamInfo from "../components/TeamInfo";
import NavBar from "../components/NavBar";
import TeamPlayers from "../components/TeamPlayers";

function TeamView() {
    return (
        <>
            <NavBar />
            <div className='mx-10'>
                <TeamInfo />
                <TeamPlayers />
            </div>
        </>
    )
}


export default TeamView;