import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Card from "../components/common/Card";

function Dashboard() {

  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="dashboard">

        <Card>

          <h1>
            Welcome, {user?.name}! 🎉
          </h1>

          <p>
            You are successfully logged in.
          </p>

          <div className="user-info">

            <p>
              <strong>User ID:</strong>{" "}
              {user?.id}
            </p>

            <p>
              <strong>Name:</strong>{" "}
              {user?.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {user?.email}
            </p>

          </div>

        </Card>

      </main>
    </>
  );
}

export default Dashboard;