import TeamInfo from "../components/TeamInfo";
import NavBar from "../components/NavBar";

function TeamView() {
    return (
        <>
            <NavBar />
            <div className='mx-10'>
                <TeamInfo />
            </div>
        </>
    )
}


export default TeamView;