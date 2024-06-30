import TeamInfo from "../components/TeamInfo";
import TeamPlayers from "../components/TeamPlayers";
import TeamSchedule from "../components/TeamSchedule";

function TeamView() {
    return (
        <>
            <div className='md:mx-10 mx-4'>
                <TeamInfo />
                <TeamPlayers />
                <TeamSchedule />
            </div>
        </>
    )
}


export default TeamView;