import { Link } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { useGetAllUsers } from "Utilities/queries/UsersQuery";

function Users() {
  const { data: result, isLoading, isError } = useGetAllUsers();

  if (isLoading) {
    return <div>loading data...</div>;
  }

  if (isError) {
    return <div>user service not available due to problems in server</div>;
  }

  const byBlogCount = (a, b) => b.blogs.length - a.blogs.length;
  const users = [...result].sort(byBlogCount);

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>
                <strong>blogs created</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`} state={user}>
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Users;
