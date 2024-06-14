import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';

const TEAMS_QUERY = gql`
  query {
    teams {
      id
      name
      coach
      roster
      city
    }
  }
`;

const ADD_TEAM_MUTATION = gql`
  mutation AddTeam($name: String!, $coach: String!, $roster: Int!, $city: String!) {
    addTeam(name: $name, coach: $coach, roster: $roster, city: $city) {
      id
      name
      coach
      roster
      city
    }
  }
`;

function AddTeamForm() {
  const [name, setName] = useState('');
  const [coach, setCoach] = useState('');
  const [roster, setRoster] = useState(0);
  const [city, setCity] = useState('');
  const [addTeam] = useMutation(ADD_TEAM_MUTATION, {
    onCompleted: () => {
      setName('');
      setCoach('');
      setRoster(0);
      setCity('');
    },
    refetchQueries: ['teams']
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addTeam({ variables: { name, coach, roster, city } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Coach"
          value={coach}
          onChange={(e) => setCoach(e.target.value)}
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Roster"
          value={roster}
          onChange={(e) => setRoster(parseInt(e.target.value))}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

function Teams() {
  const { loading, error, data } = useQuery(TEAMS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <h2>Teams</h2>
      {data.teams.map((team) => (
        <div key={team.id} className="team">
          <h3>{team.name}</h3>
          <p>Coach: {team.coach}</p>
          <p>Roster: {team.roster}</p>
          <p>City: {team.city}</p>
        </div>
      ))}
      <h2>Add a new team</h2>
      <AddTeamForm />
    </div>
  );
}

export default Teams;
