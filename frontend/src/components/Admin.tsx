import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface AttendanceRecord {
  _id: string;
  userId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  employeeName?: string;
}

interface LeaveRequest {
  _id: string;
  userId: string;
  type: string;
  reason: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

const Admin = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const attendanceResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance?populate=user`, { headers });
        const attendanceWithNames = attendanceResponse.data.map((record: any) => ({
          _id: record._id,
          userId: record.userId,
          date: record.date,
          clockIn: record.clockIn,
          clockOut: record.clockOut,
          employeeName: record.user?.name || `User ${record.userId}`
        }));
        setAttendanceData(attendanceWithNames);

        const leaveResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/leaves`, { headers });
        setLeaveRequests(leaveResponse.data);

      } catch (error: any) {
        console.error("❌ Error fetching data:", error);
        toast.error(error.response?.data?.message || "Failed to load data.");
      }
    };

    fetchData();
  }, []);

 return (
  <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-10">
    
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 tracking-tight">
          Admin Dashboard
        </h2>
        <p className="text-gray-500 mt-2">Manage attendance & leave requests</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-3 rounded-xl shadow">
          {error}
        </div>
      )}

      {/* Attendance Section */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6">
        
        <h3 className="text-2xl font-bold text-gray-800 mb-5">
          Attendance Records
        </h3>

        {attendanceData.length === 0 ? (
          <p className="text-gray-500">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl">
            <table className="min-w-full text-sm">
              
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-5 py-3 text-left">Employee</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Clock In</th>
                  <th className="px-5 py-3 text-left">Clock Out</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {attendanceData.map((record, idx) => (
                  <tr
                    key={record._id}
                    className={`hover:bg-blue-50 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-5 py-3 font-medium text-gray-700">
                      {record.employeeName}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {record.clockIn
                        ? new Date(record.clockIn).toLocaleTimeString()
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {record.clockOut
                        ? new Date(record.clockOut).toLocaleTimeString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Leave Section */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-6">

        <h3 className="text-2xl font-bold text-gray-800 mb-5">
          Leave Requests
        </h3>

        {leaveRequests.length === 0 ? (
          <p className="text-gray-500">No leave requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {leaveRequests.map((leave) => (
              <div
                key={leave._id}
                className="p-5 rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-800">{leave.type}</h4>
                  
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      leave.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : leave.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {leave.status || "Pending"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {leave.reason}
                </p>

                {leave.startDate && leave.endDate && (
                  <p className="text-gray-500 text-xs">
                    {new Date(leave.startDate).toLocaleDateString()} →{" "}
                    {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}

          </div>
        )}
      </div>

    </div>
  </div>
);}
export default Admin;