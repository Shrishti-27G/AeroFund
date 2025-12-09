import { useState } from "react";
import { loginAdmin } from "../../services/operations/adminAuthOperations";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const LoginForm = ({ switchToRegister, closeModal }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        const user = await dispatch(loginAdmin(email, password, navigate));

        if (user) {
            console.log("Logged in user:", user);
            closeModal(); // Close modal only on success
        }
    };

    return (
        <form onSubmit={submitHandler}>
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

            <button className="w-full bg-blue-600 p-3 rounded-lg font-semibold">
                Login
            </button>

            <p
                className="mt-4 text-center text-blue-200 cursor-pointer"
                onClick={switchToRegister}
            >
                New user? Register here
            </p>
        </form>
    );
};

export default LoginForm;
