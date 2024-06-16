import React from 'react';
import { useParams } from 'react-router-dom';

const TeamView: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();

  return (
    <div>
      <h1>Team View for {teamName}</h1>
      {/* Display more team details here */}
    </div>
  );
};

export default TeamView;