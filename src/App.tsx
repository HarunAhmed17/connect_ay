// Feed.jsx
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const FEED_QUERY = gql`
  query {
    feed {
      id
      description
      url
    }
  }
`;

function Feed() {
  const { loading, error, data } = useQuery(FEED_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.feed.map((link) => (
        <div key={link.id}>
          <a href={link.url}>{link.description}</a>
        </div>
      ))}
    </div>
  );
}

export default Feed;
