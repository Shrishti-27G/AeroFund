import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StationDashboard from "./pages/StationDashboard";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

// Protected Route Logic
const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
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
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
