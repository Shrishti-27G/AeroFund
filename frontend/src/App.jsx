import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";

import AdminDashboard from "./pages/AdminDashboard";
import StationDashboard from "./pages/StationDashboard";


// Protected Route Logic
const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  // if (!user) {
  //   return <Navigate to="/login" />;
  // }

  // if (role && user.role !== role) {
  //   return <Navigate to="/" />;
  // }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      

      {/* Protected Routes */}
      {/* <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/station"
        element={
          <PrivateRoute role="station">
            <StationDashboard />
          </PrivateRoute>
        }
      /> */}
    </Routes>
  );
}

export default App;
