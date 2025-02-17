import React, { useEffect, useState } from "react";

const SalarySheet = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          "http://localhost:8282/public/getAllSalary"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-transparent border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">WTL Tourism Pvt.Ltd</h1>
      <p className="italic mb-4">Employee Salary Sheet</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md">
          <thead>
            <tr className="bg-yellow-200 text-left">
              <th className="border border-gray-300 px-4 py-2">
                Employee Email
              </th>
              <th className="border border-gray-300 px-4 py-2">First Name</th>
              <th className="border border-gray-300 px-4 py-2">Last Name</th>

              <th className="border border-gray-300 px-4 py-2">Bank Acc.No</th>
              <th className="border border-gray-300 px-4 py-2">Branch Name</th>
              <th className="border border-gray-300 px-4 py-2">Bank Name</th>
              <th className="border border-gray-300 px-4 py-2">IFSC Code</th>
              <th className="border border-gray-300 px-4 py-2">Net Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {employee.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {employee.firstName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {employee.lastName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {employee.bankAccountNo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {employee.branchName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {employee.bankName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {employee.bankIfscCode}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {employee.salary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalarySheet;
