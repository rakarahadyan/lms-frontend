import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from '../assets/logo.png';
import textLogo from '../assets/text-logo.png';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Redirect to dashboard if already logged in
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post("http://localhost/lms-api/api/auth/login.php", form);
            console.log("Login success:", res.data);
            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("username", res.data.data.username);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login gagal");
            console.log(err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <div className="space-y-8">
                    <div className="text-center mb-6">
                        <div className="flex items-center mx-auto w-45 mb-3">
                            <img src={logo} alt="Logo" className="w-8 h-8" />
                            <img src={textLogo} alt="Logo" className="" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-700">
                            LMS
                        </h1>
                        <p className="text-slate-500">Masuk ke akun Anda</p>
                    </div>

                    {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-slate-600 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Masukkan email"
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-600 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Masukkan password"
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ backgroundColor: "purple" }}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-600">
                        Belum punya akun?{" "}
                        <a href="/register" className="text-purple-600 hover:underline">
                            Daftar sekarang
                        </a>
                    </p>
                </div>
            </div>
        </div>

    );
};

export default LoginPage;
