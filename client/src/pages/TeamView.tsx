import TeamInfo from "../components/TeamInfo";
import NavBar from "../components/NavBar";
import TeamPlayers from "../components/TeamPlayers";
import TeamSchedule from "../components/TeamSchedule";

function TeamView() {
    return (
        <>
            <NavBar />
            <div className='mx-10'>
                <TeamInfo />
                <TeamPlayers />
                <TeamSchedule />
            </div>
        </>
    )
}


export default TeamView;