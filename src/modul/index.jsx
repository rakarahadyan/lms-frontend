import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import textLogo from '../assets/text-logo.png';
import ConfirmationDialog from "../component/ConfirmationDialog";
import Modal from "../component/Modal";
import { Input, Textarea } from '@headlessui/react'
import { Settings, Calendar, Power, User, MessageSquare, BookOpen, Users, Grid, SquarePen, Trash2, Bell, Mail, Search } from 'lucide-react';

const Modul = () => {
    const navigate = useNavigate();
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        start_date: "",
        end_date: "",
        status: "draft",
    });

    // Search & Pagination state
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch data course
    const fetchCourse = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.get(
                "http://localhost/lms-api/api/courses/list.php",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setCourseList(res.data.data || []);
        } catch (error) {
            console.error("Error fetch course:", error);
            alert("Gagal mengambil data course");
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [navigate]);

    // Filter hasil search
    const filteredCourses = courseList.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            if (editingCourse) {
                // Update
                await axios.post(
                    "http://localhost/lms-api/api/courses/update.php",
                    { id: editingCourse.id, ...formData },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // alert("Course berhasil diupdate");
            } else {
                // Create
                await axios.post(
                    "http://localhost/lms-api/api/courses/create.php",
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // alert("Course berhasil ditambahkan");
            }
            setShowForm(false);
            setEditingCourse(null);
            setFormData({
                title: "",
                description: "",
                category: "",
                start_date: "",
                end_date: "",
                status: "draft",
            });
            fetchCourse();
        } catch (error) {
            console.error("Error submit:", error);
            alert("Gagal menyimpan course");
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            category: course.category,
            start_date: course.start_date,
            end_date: course.end_date,
            status: course.status,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin hapus course ini?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "http://localhost/lms-api/api/courses/delete.php",
                { id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // alert("Course berhasil dihapus");
            fetchCourse();
        } catch (error) {
            console.error("Error delete:", error);
            alert("Gagal menghapus course");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.reload();
    };

    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="flex h-screen w-screen bg-gray-50 font-sans overflow-hidden">
            <div className="w-52 flex flex-col text-white">
                <div className="flex items-center py-7 px-2">
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                    <img src={textLogo} alt="Logo" className="h-8" />
                </div>

                <div className="px-6 py-9 bg-gray-800 text-gray-800 rounded-tr-4xl flex flex-col h-full">
                    <nav className="space-y-1">
                        <div onClick={() => navigate("/dashboard")} className="text-gray-500 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center text-sm">
                            <Grid className="w-4 h-4 mr-3" />
                            Dashboard
                        </div>
                        <div className="bg-white text-gray-800 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center text-sm">
                            <BookOpen className="w-4 h-4 mr-3" />
                            Modul
                        </div>
                        <div onClick={() => navigate("/peserta")} className="text-gray-500 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center text-sm">
                            <Users className="w-4 h-4 mr-3" />
                            Peserta
                        </div>
                        <div onClick={() => navigate("/group-chat")} className="text-gray-500 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center text-sm">
                            <MessageSquare className="w-4 h-4 mr-3" />
                            Group Chat
                        </div>
                        <div onClick={() => navigate("/pemateri")} className="text-gray-500 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center text-sm">
                            <User className="w-4 h-4 mr-3" />
                            Pemateri
                        </div>
                    </nav>

                    <hr className="border-gray-700 my-6" />

                    <div>
                        <h3 className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
                            Profile
                        </h3>
                        <div className="space-y-1">
                            <div className="text-gray-300 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center text-sm">
                                <Settings className="w-4 h-4 mr-3" />
                                Settings
                            </div>
                            <div className="text-gray-300 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center text-sm">
                                <Calendar className="w-4 h-4 mr-3" />
                                Kalender
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-700 my-6" />

                    <div className="text-gray-300 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center text-sm" onClick={() => setShowDialog(true)}>
                        <Power className="w-4 h-4 mr-3 text-red-500" />
                        Log Out
                    </div>

                    <ConfirmationDialog
                        isOpen={showDialog}
                        title="Logout Confirmation"
                        description="Are you sure you want to logout?"
                        onCancel={() => setShowDialog(false)}
                        onConfirm={handleLogout}
                        confirmText="Logout"
                        cancelText="Cancel"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="p-5 flex-1 overflow-y-auto scrollbar-hidden">
                    <div className="flex items-center justify-between pb-7">
                        <div className="flex items-center">
                            <h3 className="font-bold text-gray-800 mr-9">LEARNING MANAGEMENT SYSTEM</h3>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search class..."
                                    className="pl-12 pr-4 py-2 border border-gray-300 rounded-lg w-80 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    // value={searchTerm}
                                    // onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Bell className="w-9 h-9 text-gray-400 bg-white p-2 rounded-lg mx-6" />
                            <Mail className="w-9 h-9 text-gray-400 bg-white p-2 rounded-lg" />
                        </div>
                    </div>
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Daftar Modul</h2>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="text"
                                placeholder="Cari modul..."
                                className="border rounded px-2 py-1 text-sm"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // reset halaman ke 1 saat search
                                }}
                            />
                            <button
                                onClick={() => {
                                    setEditingCourse(null);
                                    setFormData({
                                        title: "",
                                        description: "",
                                        category: "",
                                        start_date: "",
                                        end_date: "",
                                        status: "draft",
                                    });
                                    setShowForm(true);
                                }}
                                style={{ backgroundColor: "purple" }}
                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                + Tambah Modul
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-xl shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Judul
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    [...Array(3)].map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4">
                                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
                                            </td>
                                        </tr>
                                    ))
                                ) : currentCourses.length > 0 ? (
                                    currentCourses.map((c, index) => (
                                        <tr key={c.id}>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {c.title}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{c.category}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {c.start_date} - {c.end_date}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{c.status}</td>
                                            <td className="flex items-center px-6 py-4 text-right ">
                                                <SquarePen
                                                    onClick={() => handleEdit(c)}
                                                    className="inline-block w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
                                                />
                                                <Trash2
                                                    onClick={() => handleDelete(c.id)}
                                                    className="inline-block w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            Tidak ada modul
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-600">
                            Halaman {currentPage} dari {totalPages || 1}
                        </span>
                        <div className="space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 text-sm border rounded ${currentPage === i + 1 ? "bg-gray-200" : ""
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {showForm && (
                        <Modal
                            isOpen={showForm}
                            onClose={() => setShowForm(false)}
                            title={editingCourse ? "Edit Course" : "Tambah Course"}
                            footer={
                                <>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        style={{ backgroundColor: "purple" }}
                                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                    >
                                        Simpan
                                    </button>
                                </>
                            }
                        >
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <Input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Judul"
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />

                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Deskripsi"
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />

                                <Input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    placeholder="Kategori"
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />

                                <Input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />

                                <Input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </form>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};


export default Modul;
