import { useState } from "react";
import { loginAdmin } from "../../services/operations/adminAuthOperations";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ switchToRegister, closeModal }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        const user = await dispatch(loginAdmin(email, password, navigate));

        if (user) {
            console.log("Logged in user:", user);
            closeModal();
        }
    };

    return (
        <form onSubmit={submitHandler}>
            {/* Email */}
            <input
                type="email"
                placeholder="Email"
                className="w-full p-2 mb-3 rounded bg-white text-black"
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            {/* Password Field with Custom Eye Toggle */}
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-2 mb-4 rounded bg-white text-black pr-10"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"   // removes browser auto-eye
                    required
                />

                {/* Show/Hide Icon */}
                <span
                    className="absolute right-3 top-5 -translate-y-1/2 cursor-pointer text-black text-2xl"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "🙈" : "👁️"}
                </span>

            </div>

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
