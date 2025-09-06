import React, { useState, useEffect } from 'react';
import { Search, Settings, Calendar, Power, User, MessageSquare, BookOpen, Users, ChevronLeft, ChevronRight, Bell, Mail, Grid } from 'lucide-react';
import logo from '../assets/logo.png';
import textLogo from '../assets/text-logo.png';
import ConfirmationDialog from "../component/ConfirmationDialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TypingText from "../component/TypingText";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [studentScores, setStudentScores] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [modulList, setModulList] = useState([]);
  const [lastModul, setLastModul] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const username = localStorage.getItem("username");

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Fetch API dengan 1 endpoint
  useEffect(() => {
    const fetchData = async () => {

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // redirect ke login
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get("http://localhost/lms-api/api/dashboard/list.php", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.data.status) {
          handleLogout();
        }

        setLastModul(res.data.data.top || []);
        // setModulList(res.data.data.modul || []);
        setStudentScores(res.data.data.nilai || []);
        setScheduleItems(res.data.data.jadwal || []);

        const modulData = res.data.data.modul || [];
        const modulArray = Array.isArray(modulData)
          ? modulData
          : Object.keys(modulData).map((key) => ({
            category: key,
            courses: modulData[key],
          }));

        setModulList(modulArray);

        // console.log(
        //   res.data.data.top
        // );

      } catch (error) {
        console.error("Error fetching dashboard data", error);
        alert(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };

    fetchData();
  }, [navigate]);

  // ambil minggu dari date saat ini
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const prevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
  }

  return (
    <div className="flex h-screen w-screen bg-gray-50 font-sans overflow-hidden">
      <div className="w-52 flex flex-col text-white">
        <div className="flex items-center py-7 px-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <img src={textLogo} alt="Logo" className="h-8" />
        </div>

        <div className="px-6 py-9 bg-gray-800 text-gray-800 rounded-tr-4xl flex flex-col h-full">
          <nav className="space-y-1">
            <div className="bg-white text-gray-800 px-4 py-2 rounded flex items-center text-sm">
              <Grid className="w-4 h-4 mr-3" />
              Dashboard
            </div>
            <div onClick={() => navigate("/modul")} className="text-gray-500 px-4 py-2 hover:bg-gray-700 rounded cursor-pointer flex items-center text-sm">
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Bell className="w-9 h-9 text-gray-400 bg-white p-2 rounded-lg mx-6" />
              <Mail className="w-9 h-9 text-gray-400 bg-white p-2 rounded-lg" />
            </div>
          </div>

          {loading ? (
            // SKELETON untuk highlight course
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden animate-pulse">
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-4 bg-purple-300/40 rounded w-32 mb-4"></div>
                    <div className="h-6 bg-purple-300/40 rounded w-2/3 mb-3"></div>
                    <div className="h-6 bg-purple-300/40 rounded w-1/2 mb-6"></div>
                    <div className="h-4 bg-purple-300/40 rounded w-full mb-2"></div>
                    <div className="h-4 bg-purple-300/40 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-purple-300/40 rounded w-2/3 mb-6"></div>

                    <div className="flex justify-between items-center">
                      <div className="space-x-4 flex">
                        <div className="h-4 bg-purple-300/40 rounded w-28"></div>
                        <div className="h-4 bg-purple-300/40 rounded w-24"></div>
                      </div>
                      <div className="h-10 bg-purple-300/40 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // KONTEN asli highlight course
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-yellow-300 text-sm font-medium mb-2 uppercase tracking-wide">
                      {/* {console.log(lastModul)} */}
                      {lastModul[0]?.category}
                    </p>
                    <h2 className="text-xl font-bold mb-4 leading-tight">
                      {lastModul[0]?.title}
                    </h2>
                    <p className="text-purple-100 text-sm mb-6 max-w-lg leading-relaxed">
                      {lastModul[0]?.description}
                    </p>
                    <div className="flex justify-between items-center text-sm space-x-8">
                      <div className="w-1/2 flex justify-between items-center">
                        <span className="text-purple-200 flex items-center">
                          <span className="mr-2">
                            <User className="w-4 h-4" />{" "}
                          </span>
                          Pemateri By {lastModul[0]?.instructor_name}
                        </span>
                        <span className="text-purple-200 flex items-center">
                          <span className="mr-2">
                            <Calendar className="w-4 h-4" />
                          </span>
                          {lastModul[0]?.start_date}
                        </span>
                      </div>
                      <button className="w-1/4 bg-white text-purple-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                        MULAI LEARNING
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 opacity-20 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-8 w-32 h-32 bg-purple-400 opacity-30 rounded-lg"></div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6">MODUL KOMPETENSI</h2>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-xl h-60"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {Array.isArray(modulList) ? (
                  (() => {
                    const filteredModuls = modulList
                      .map((modul) => ({
                        ...modul,
                        courses: modul.courses.filter((course) =>
                          course.title.toLowerCase().includes(searchTerm.toLowerCase())
                        ),
                      }))
                      .filter((modul) => modul.courses.length > 0);

                    if (filteredModuls.length === 0) {
                      return (
                        <div className="col-span-3 text-center text-gray-500 py-10">
                          Kelas tidak ada
                        </div>
                      );
                    }

                    return filteredModuls.map((modul, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="relative h-40 p-3">
                          <img
                            src={modul.cover_image || "https://picsum.photos/400/200"}
                            alt={modul.category}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                            <h3 className="text-lg font-semibold text-white">
                              {modul.category.toUpperCase()}
                            </h3>
                          </div>
                        </div>

                        <div className="p-6">
                          <h4 className="text-sm font-semibold mb-4">MATERI KOMPETENSI</h4>
                          <ul className="text-sm divide-y divide-gray -mx-6">
                            {modul.courses.map((course, i) => (
                              <li
                                key={i}
                                className={`px-6 py-2 ${course.id === lastModul[0]?.id ? "bg-yellow-300" : ""
                                  }`}
                              >
                                {course.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ));
                  })()
                ) : null}
              </div>

            )}

          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-6 uppercase tracking-wide">NILAI PESERTA</h3>
            {loading ? (
              <div className="bg-white rounded-xl shadow p-6 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-200 rounded mb-3"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="uppercase tracking-wide font-medium text-gray-600">
                    <tr>
                      <th scope="col" className="px-4 py-2 w-5">RANK</th>
                      <th scope="col" className="px-4 py-2">NAME</th>
                      <th scope="col" className="px-4 py-2 w-25">CLASS</th>
                      <th scope="col" className="px-4 py-2 ">MODUL</th>
                      <th scope="col" className="px-4 py-2 w-35">POINT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentScores.map((student, index) => {
                      let medal = null;
                      if (index === 0) {
                        medal = "🥇";
                      } else if (index === 1) {
                        medal = "🥈";
                      } else if (index === 2) {
                        medal = "🥉";
                      }

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-800">
                            {medal || ""}
                          </td>
                          <td className="px-4 py-2 font-medium text-gray-800">{student.user_name}</td>
                          <td className="px-4 py-2 text-gray-600">{student.category}</td>
                          <td className="px-4 py-2 text-gray-600">{student.course_title}</td>
                          <td className="px-4 py-2 text-green-600">{student.points} Point</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-85 h-screen bg-white p-4 flex flex-col justify-between min-y-0">
        <div>
          <div className="relative w-25 h-25 mx-auto mb-4">
            <img
              src="https://randomuser.me/api/portraits/men/10.jpg"
              alt="Profile"
              className="w-25 h-25 rounded-full object-cover"
            />

            <Settings
              size={15}
              className="absolute top-0 right-0 text-gray-700 cursor-pointer hover:text-gray-900"
            />
          </div>
          <div className="bg-white rounded-2xl mb-6 text-center">
            <h3 className="font-bold text-gray-800 text-lg">
              SELAMAT DATANG,{" "}
              {loading ? (
                <span className="inline-block bg-gray-200 rounded-md h-5 w-32 animate-pulse"></span>
              ) : (
                username
              )}
            </h3>
            <p className="text-gray-500 text-sm">Di LMS by Adhivasindo</p>
          </div>

          <div className="bg-[#2D2159] text-white rounded-2xl p-4 mb-4 mx-auto">
            <div className="flex items-center justify-between mb-4">
              <ChevronLeft onClick={prevMonth} className="w-5 h-5" />
              <h2 className="text-lg font-semibold">
                {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
              </h2>
              <ChevronRight onClick={nextMonth} className="w-5 h-5" />
            </div>

            <div className="flex space-x-2">
              {week.map((d, i) => {
                const isToday =
                  d.getDate() === date.getDate() &&
                  d.getMonth() === date.getMonth() &&
                  d.getFullYear() === date.getFullYear();

                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center w-10 rounded-lg p-2 border ${isToday
                      ? "bg-white text-[#2D2159] border-white font-semibold"
                      : "bg-transparent border-white/40"
                      }`}
                  >
                    <span className="text-xs">{days[i]}</span>
                    <span>{d.getDate()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto scrollbar-hidden" >
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-6 uppercase tracking-wide text-sm">JADWAL PEMATERI</h3>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {scheduleItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-12 h-12 mr-4 flex-shrink-0"
                        style={{ backgroundColor: getRandomColor() }}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium leading-tight">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {scheduleItems.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br mb-4 from-blue-600 to-blue-800 rounded-2xl h-48 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={item.cover_image ? item.cover_image : "https://picsum.photos/400/200"}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;