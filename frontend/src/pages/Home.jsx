

import { useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState("admin");
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [station, setStation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


 const submitHandler = async (e) => {
  e.preventDefault();
  try {
    const endpoint = isRegister ? "/auth/register" : "/auth/login";
    const payload = isRegister
      ? {
          name,
          station: station,
          role,
          email,
          password,
        } 
      : { email, password };

    const res = await API.post(endpoint, payload);
    setUser(res.data);
    setShowModal(false);
    navigate(res.data.role === "admin" ? "/admin" : "/station");
  } catch (err) {
    alert("Error: Invalid credentials!");
  }
};


  return (
    <section className="relative w-full min-h-screen bg-[#050A13] text-white flex items-center justify-center overflow-hidden">

      {/* Subtle animated grid background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,40,80,0.3),transparent_80%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Glow bottom */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] h-60 bg-gradient-to-t from-[#004A6F33] to-transparent blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5 }}
      />

      {/* Main content */}
      <motion.div
        className="z-10 text-center px-6 max-w-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold tracking-wide drop-shadow-[0_0_45px_rgba(0,170,255,0.4)]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          AeroFund Portal
        </motion.h1>

        <motion.div
          className="h-1 bg-gradient-to-r from-[#00AEEF] to-[#0090FF] mt-3 mx-auto rounded-sm"
          initial={{ width: 0 }}
          animate={{ width: 180 }}
          transition={{ duration: 1.2 }}
        />

        <motion.p
          className="text-blue-200 mt-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Welcome to the centralized financial dashboard for airport infrastructure — 
          track allocations, utilization, and reports securely and efficiently.
        </motion.p>

        {/* Buttons */}
        <div className="flex gap-6 justify-center mt-10">
          <motion.button
            onClick={() => { setShowModal(true); setIsRegister(false); }}
            className="px-8 py-3 rounded-full font-semibold border border-[#0090FF] text-blue-200 backdrop-blur-md"
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 22px rgba(0,160,255,0.9)",
              backgroundColor: "rgba(0,160,255,0.9)",
              color: "#fff",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>

          <motion.button
            onClick={() => { setShowModal(true); setIsRegister(true); }}
            className="px-8 py-3 rounded-full font-semibold border border-[#0090FF] text-blue-200 backdrop-blur-md"
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 22px rgba(0,160,255,1)",
              backgroundColor: "rgba(0,160,255,1)",
              color: "#fff",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex justify-center items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0A1A2F]/60 border border-[#00C6FF66] p-8 rounded-xl w-full max-w-md shadow-[0_0_35px_rgba(0,160,255,0.35)] backdrop-blur-2xl relative"
              initial={{ scale: 0.7, opacity: 0, y: 35 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.45, type: "spring", stiffness: 120 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center drop-shadow-[0_0_12px_#00C9FF]">
                {isRegister ? "Create Account" : "Login"}
              </h2>

              
              <div className="flex justify-between mb-6 gap-4">
                {["admin", "station"].map((r) => (
                  <motion.button
                    key={r}
                    whileHover={{
                      scale: 1.07,
                      boxShadow: "0 0 20px rgba(0,160,255,0.9)",
                    }}
                    className={`w-full py-2 rounded-lg transition-all font-semibold 
                      ${role === r ? "bg-blue-500 text-white" : "bg-white/10 text-blue-200"}`}
                    onClick={() => setRole(r)}
                  >
                    {r === "admin" ? "Admin" : "Station User"}
                  </motion.button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={submitHandler}>
                {isRegister && (
                  <>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-2 mb-3 rounded bg-white text-black"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

              
                      <input
                        type="text"
                        placeholder="Station Name"
                        className="w-full p-2 mb-3 rounded bg-white text-black"
                        onChange={(e) => setStation(e.target.value)}
                        required
                      />
                    
                  </>
                )}

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 mb-3 rounded bg-white text-black"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 mb-4 rounded bg-white text-black"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0,160,255,1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold transition-all"
                >
                  {isRegister ? "Register" : "Login"}
                </motion.button>
              </form>

              <p
                className="text-sm mt-4 text-center cursor-pointer text-blue-200 hover:underline"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? "Already have an account? Login" : "New user? Register here"}
              </p>

              <motion.button
                whileHover={{ scale: 1.2, color: "#ff4d4d" }}
                className="absolute top-3 right-4 text-xl text-blue-200"
                onClick={() => setShowModal(false)}
              >
                ×
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Home;
