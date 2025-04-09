// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useApp } from '../../context/AppContext';

// const SubAdminDashboard = () => {
//   const { user } = useApp();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-gray-100 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-slate-800 rounded-lg shadow-xl p-6">
//           <h1 className="text-2xl font-bold mb-6">Sub-Admin Dashboard</h1>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Dashboard Cards */}
//             <div className="bg-slate-700 rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300">
//               <h2 className="text-xl font-semibold mb-4">Employee Management</h2>
//               <p className="text-gray-300 mb-4">Manage employee records and information</p>
//               <Link to="/dashboard/addEmp" className="text-blue-400 hover:text-blue-300">
//                 View Employees →
//               </Link>
//             </div>

//             <div className="bg-slate-700 rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300">
//               <h2 className="text-xl font-semibold mb-4">Attendance</h2>
//               <p className="text-gray-300 mb-4">Track and manage employee attendance</p>
//               <Link to="/dashboard/attendance" className="text-blue-400 hover:text-blue-300">
//                 View Attendance →
//               </Link>
//             </div>

//             <div className="bg-slate-700 rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300">
//               <h2 className="text-xl font-semibold mb-4">Salary Management</h2>
//               <p className="text-gray-300 mb-4">Handle salary calculations and payments</p>
//               <Link to="/dashboard/salarysheet" className="text-blue-400 hover:text-blue-300">
//                 View Salary →
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubAdminDashboard; 