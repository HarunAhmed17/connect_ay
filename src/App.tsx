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
      players {
        id
        name
        age
        position
      }
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

const ADD_PLAYER_MUTATION = gql`
  mutation AddPlayer($name: String!, $age: Int!, $position: String!, $teamId: Int!) {
    addPlayer(name: $name, age: $age, position: $position, teamId: $teamId) {
      id
      name
      age
      position
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

function AddPlayerForm({ teamId }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [position, setPosition] = useState('');
  const [addPlayer] = useMutation(ADD_PLAYER_MUTATION, {
    onCompleted: () => {
      setName('');
      setAge(0);
      setPosition('');
    },
    refetchQueries: ['teams']
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addPlayer({ variables: { name, age, position, teamId } });
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
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
      </div>
      <button type="submit">Add Player</button>
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
          <h4>Players:</h4>
          <ul>
            {team.players.map((player) => (
              <li key={player.id}>
                {player.name} - {player.age} - {player.position}
              </li>
            ))}
          </ul>
          <h4>Add a new player to {team.name}</h4>
          <AddPlayerForm teamId={team.id} />
        </div>
      ))}
      <h2>Add a new team</h2>
      <AddTeamForm />
    </div>
  );
}

export default Teams;
