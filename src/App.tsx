import React, {useState} from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';

const FEED_QUERY = gql`
  query {
    feed {
      id
      description
      url
    }
  }
`;

const POST_LINK_MUTATION = gql`
  mutation PostLink($url: String!, $description: String!) {
    postLink(url: $url, description: $description) {
      id
      description
      url
    }
  }
`;

function PostLinkForm() {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [postLink] = useMutation(POST_LINK_MUTATION, {
    onCompleted: () => {
      setUrl('');
      setDescription('');
    },
    refetchQueries: ['feed']
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await postLink({ variables: { url, description } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

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
      <h2>Add a new link</h2>
      <PostLinkForm />
    </div>
  );
}

export default Feed;
