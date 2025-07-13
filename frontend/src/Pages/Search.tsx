import { Link, useParams } from 'react-router-dom';
import { useSearchUsers } from '../Hooks/userHook';
import { Avatar, Card } from '@mui/material';

export default function Search() {
  const { searchQuery } = useParams();
  const { data, isLoading } = useSearchUsers(searchQuery || '');

  if (isLoading) {
    return <h2>Loading</h2>;
  } else {
    return (
      <Card className="flex flex-col gap-2 w-[90%] md:w-1/3 p-5 mt-12 mx-auto">
        <h2>Search Results</h2>
        {data?.map((person, index) => {
          return (
            <Link
              className="flex flex-row p-2 gap-2 border border-gray-200 "
              key={index}
              to={`/${person.name}`}
            >
              <Avatar
                src={`https://nazmul.sirv.com/facebook/${person.name}.png`}
              />
              <p> {person.name} </p>
            </Link>
          );
        })}
      </Card>
    );
  }
}
