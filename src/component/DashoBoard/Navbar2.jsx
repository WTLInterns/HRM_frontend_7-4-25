import React, { useEffect } from 'react'
import { useApp } from '../../context/AppContext';

const Navbar2 = () => {

    const { fetchAllEmp, emp, logoutUser } = useApp();

    useEffect(() => {
        fetchAllEmp();
      }, []);
    
      // Count active and inactive employees
      const activeEmp = emp.filter((employee) => employee.status === "active");
      const inactiveEmp = emp.filter((employee) => employee.status === "inactive");
      const activeEmpCount = activeEmp.length;
      const inactiveEmpCount = inactiveEmp.length;
    
      // Group employees by job role and count active/inactive for each role
      const jobRoleSummary = emp.reduce((acc, employee) => {
        const role = employee.jobRole;
        if (!acc[role]) {
          acc[role] = { active: 0, inactive: 0 };
        }
        if (employee.status === "active") {
          acc[role].active += 1;
        } else {
          acc[role].inactive += 1;
        }
        return acc;
      }, {});
  
  return (
    <div>
    <div className="bg-white shadow-md p-4 rounded-lg col-span-3">
      <h2 className="text-xl font-bold text-gray-700">Employees by Job Role</h2>
      <div className="flex flex-wrap gap-4 mt-4">
        {Object.entries(jobRoleSummary).map(([role, counts]) => (
          <div
            key={role}
            className="flex flex-col bg-blue-100 p-4 rounded-lg shadow-md w-40"
          >
            <div className="text-sm font-semibold truncate">{role}</div>
            <div className="flex items-center text-sm mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1"></span>
              <span>{counts.active}</span>
              <span className="mx-2">|</span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></span>
              <span>{counts.inactive}</span>
            </div>
          </div>
        ))}
      </div>
    </div></div>
  )
}

export default Navbar2