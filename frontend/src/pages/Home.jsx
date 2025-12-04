import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "../components/authComponent/AuthModal";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="relative w-full min-h-screen bg-[#050A13] text-white flex items-center justify-center overflow-hidden">

      {/* Background + Title + Buttons */}
      <motion.div className="z-10 text-center px-6 max-w-xl">
        <h1 className="text-5xl md:text-6xl font-bold">AeroFund Portal</h1>

        <div className="flex gap-6 justify-center mt-10">
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 rounded-full font-semibold border border-[#0090FF]"
          >
            Login / Register
          </button>
        </div>
      </motion.div>

      {/* AUTH MODAL */}
      <AuthModal showModal={showModal} setShowModal={setShowModal} />

    </section>
  );
};

export default Home;
