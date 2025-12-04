import { useState } from "react";
import { signupAdmin } from "../../services/operations/adminAuthOperations";
import { toast } from "sonner";

const SignupForm = ({ switchToLogin, closeModal }) => {
    const role = "admin"; // fixed role

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();

        const adminData = { name, email, password, phone };

        try {
            const result = await signupAdmin(
                name,
                email,
                password,
                phone
            );

            if (!result) {
                toast.error("Signup failed");
                return;
            }

            toast.success("Admin account created successfully!");
            closeModal();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <p className="text-center text-blue-300 font-semibold mb-4">
                Registering as <span className="text-blue-400">Admin</span>
            </p>

            <form onSubmit={submitHandler}>
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-2 mb-3 rounded bg-white text-black"
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-3 rounded bg-white text-black"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full p-2 mb-3 rounded bg-white text-black"
                    onChange={(e) => setPhone(e.target.value)}
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
                    Register as Admin
                </button>

                <p
                    className="mt-4 text-center text-blue-200 cursor-pointer"
                    onClick={switchToLogin}
                >
                    Already have an account? Login
                </p>
            </form>
        </>
    );
};

export default SignupForm;
