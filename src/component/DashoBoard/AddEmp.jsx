"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApp } from "../../context/AppContext";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

export default function AddEmp() {
  const { addEmp, fetchAllEmp, emp, deleteEmployee, updateEmployee } = useApp();

  // States for Add/Update Employee fields
  const [firstName, setFname] = useState("");
  const [lastName, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadharNo, setaadharNo] = useState("");
  const [panCard, setpanCard] = useState("");
  const [education, seteducation] = useState("");
  const [bloodGroup, setbloodGroup] = useState("");
  const [jobRole, setjobRole] = useState("");
  const [gender, setgender] = useState("");
  const [address, setaddress] = useState("");
  const [birthDate, setbirthDate] = useState("");
  const [joiningDate, setjoiningDate] = useState("");
  const [status, setstatus] = useState("");
  const [bankName, setbankName] = useState("");
  const [bankIfscCode, setbankIfscCode] = useState("");
  const [branchName, setbranchName] = useState("");
  const [salary, setsalary] = useState("");
  const [bankAccountNo, setbankAccountNo] = useState("");

  // Modal states: add modal and update modal
  const [modal, setModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  // Selected employee for update
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Search and Pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;
  const totalPages = Math.ceil(
    emp.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / employeesPerPage
  );

  useEffect(() => {
    // No need to fetch on every render
    // Only fetch if adding or updating employees
    // This useEffect is triggered by the dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addEmp, updateEmployee]);

  // Add a separate effect to fetch on initial load if needed
  useEffect(() => {
    if (!emp || emp.length === 0) {
      fetchAllEmp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []);

  // Filter employees based on search term
  const filteredEmployees = emp.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  const handleModalToggle = () => {
    setModal(!modal);
  };

  const handleUpdateModalToggle = () => {
    setUpdateModal(!updateModal);
    if (updateModal) {
      // Clear update state when closing the modal
      setSelectedEmployee(null);
    }
  };

  // Validation function for all fields
  const validateFields = () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !aadharNo ||
      !panCard ||
      !education ||
      !bloodGroup ||
      !jobRole ||
      !gender ||
      !address ||
      !birthDate ||
      !joiningDate ||
      !status ||
      !bankName ||
      !bankAccountNo ||
      !bankIfscCode ||
      !branchName ||
      !salary
    ) {
      toast.error("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    // Aadhaar validation in the format: "1234 4567 7890"
    if (!/^\d{4}\s\d{4}\s\d{4}$/.test(aadharNo)) {
      toast.error("Please enter a valid Aadhaar number in the format: 1234 4567 7890");
      return false;
    }
    if (isNaN(salary) || Number(salary) <= 0) {
      toast.error("Please enter a valid salary amount");
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(bankName)) {
      toast.error("Please enter a valid bank name (alphabets and spaces only)");
      return false;
    }
    return true;
  };

  // Add Employee submission
  const handleAddEmp = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    try {
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        aadharNo,
        panCard,
        education,
        bloodGroup,
        jobRole,
        gender,
        address,
        birthDate,
        joiningDate,
        status,
        bankName,
        bankAccountNo,
        bankIfscCode,
        branchName,
        salary,
      };
      await addEmp(userData);
      toast.success("Registered Successfully");
      setModal(false);
      handleReset(e);
    } catch (err) {
      toast.error("Failed to register user");
    }
  };

  // Delete Employee
  const handleDeleteEmp = async (empId) => {
    try {
      await deleteEmployee(empId);
      toast.success("Employee deleted successfully");
      fetchAllEmp();
    } catch (err) {
      toast.error("Failed to delete employee");
    }
  };

  // When clicking the edit icon, populate update modal with employee info
  const handleEditEmp = (employee) => {
    setSelectedEmployee(employee);
    setFname(employee.firstName);
    setLname(employee.lastName);
    setEmail(employee.email);
    setPhone(employee.phone);
    setaadharNo(employee.aadharNo);
    setpanCard(employee.panCard);
    seteducation(employee.education);
    setbloodGroup(employee.bloodGroup);
    setjobRole(employee.jobRole);
    setgender(employee.gender);
    setaddress(employee.address);
    setbirthDate(employee.birthDate);
    setjoiningDate(employee.joiningDate);
    setstatus(employee.status);
    setbankName(employee.bankName);
    setbankAccountNo(employee.bankAccountNo);
    setbankIfscCode(employee.bankIfscCode);
    setbranchName(employee.branchName);
    setsalary(employee.salary);
    setUpdateModal(true);
  };

  // Reset function to clear all form fields
  const handleReset = async (e) => {
    e.preventDefault();
    setFname("");
    setLname("");
    setEmail("");
    setPhone("");
    setaadharNo("");
    setpanCard("");
    seteducation("");
    setbloodGroup("");
    setjobRole("");
    setgender("");
    setaddress("");
    setbirthDate("");
    setjoiningDate("");
    setstatus("");
    setbankName("");
    setbankAccountNo("");
    setbankIfscCode("");
    setbranchName("");
    setsalary("");
  };

  // Update Employee submission
  const handleUpdateEmp = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    try {
      const updatedData = {
        firstName,
        lastName,
        email,
        phone,
        aadharNo,
        panCard,
        education,
        bloodGroup,
        jobRole,
        gender,
        address,
        birthDate,
        joiningDate,
        status,
        bankName,
        bankAccountNo,
        bankIfscCode,
        branchName,
        salary,
      };
      await updateEmployee(selectedEmployee.empId, updatedData);
      toast.success("Employee updated successfully");
      setUpdateModal(false);
      setSelectedEmployee(null);
      fetchAllEmp();
    } catch (err) {
      toast.error("Failed to update employee");
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Employee Management</h1>
        <button
          onClick={handleModalToggle}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Add New Employee
        </button>
      </div>

      {/* Search and Pagination Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="w-full sm:w-64 mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm">
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-2 rounded-lg ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Employee List - Responsive Table */}
      {currentEmployees.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Role
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentEmployees.map((employee) => (
                  <tr key={employee.empId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{employee.jobRole}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => handleEditEmp(employee)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <CiEdit className="text-xl" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmp(employee.empId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <MdDeleteOutline className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View - Cards */}
          <div className="md:hidden">
            {currentEmployees.map((employee) => (
              <div
                key={employee.empId}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-medium">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-xs text-gray-500">{employee.email}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mb-3">
                    <div>
                      <span className="text-gray-500">Phone:</span> {employee.phone}
                    </div>
                    <div>
                      <span className="text-gray-500">Job:</span> {employee.jobRole}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditEmp(employee)}
                      className="p-2 text-indigo-600 hover:text-indigo-900"
                    >
                      <CiEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmp(employee.empId)}
                      className="p-2 text-red-600 hover:text-red-900"
                    >
                      <MdDeleteOutline className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-lg shadow-md">
          <p className="text-gray-500">
            {emp.length === 0
              ? "No employees found. Add your first employee!"
              : "No employees match your search criteria."}
          </p>
        </div>
      )}

      {/* Add Employee Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Add New Employee
                  </h3>
                  <button
                    onClick={handleModalToggle}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleAddEmp} className="overflow-y-auto max-h-[70vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Form fields go here - keep these responsive */}
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name:
                      </label>
                      <input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFname(e.target.value)}
                        placeholder="Enter your first name"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name:
                      </label>
                      <input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLname(e.target.value)}
                        placeholder="Enter your last name"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email ID:
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                        Contact No:
                      </label>
                      <input
                        id="contact"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your 10-digit contact number"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="aadharNo" className="block text-sm font-medium text-gray-700">
                        Aadhar No:
                      </label>
                      <input
                        id="aadharNo"
                        value={aadharNo}
                        onChange={(e) => setaadharNo(e.target.value)}
                        placeholder="Enter your 12-digit Aadhar number"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="panCard" className="block text-sm font-medium text-gray-700">
                        Pancard No:
                      </label>
                      <input
                        id="panCard"
                        value={panCard}
                        onChange={(e) => setpanCard(e.target.value)}
                        placeholder="Enter your PAN card (e.g., ABCDE1234F)"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                        Education:
                      </label>
                      <select
                        id="education"
                        value={education}
                        onChange={(e) => seteducation(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select education</option>
                        <option value="hsc">HSC</option>
                        <option value="graduate">Graduate</option>
                        <option value="post-graduate">Post Graduate</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                        Blood Group:
                      </label>
                      <select
                        id="bloodGroup"
                        value={bloodGroup}
                        onChange={(e) => setbloodGroup(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select blood group</option>
                        <option value="a+">A+</option>
                        <option value="b+">B+</option>
                        <option value="o+">O+</option>
                        <option value="ab+">AB+</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700">
                        Job Role:
                      </label>
                      <select
                        id="jobRole"
                        value={jobRole}
                        onChange={(e) => setjobRole(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select job role</option>
                        <option value="HR">HR</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="JAVA FULL STACK DEVELOPER">JAVA FULL STACK DEVELOPER</option>
                        <option value="MERN STACK  DEVELOPER">MERN STACK DEVELOPER</option>
                        <option value="SUPERVISOR">SUPERVISOR</option>
                        <option value="DIGITAL MARKETING INTERN">DIGITAL MARKETING INTERN</option>
                        <option value="TELECALLER EXCUTIVE">TELECALLER EXECUTIVE</option>
                        <option value="BACK OFFICE">BACK OFFICE</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender:
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setgender(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address:
                      </label>
                      <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setaddress(e.target.value)}
                        placeholder="Enter your full address"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                        Birth Date:
                      </label>
                      <input
                        id="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setbirthDate(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Select your birth date"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700">
                        Joining Date:
                      </label>
                      <input
                        id="joiningDate"
                        type="date"
                        value={joiningDate}
                        onChange={(e) => setjoiningDate(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Select your joining date"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status:
                      </label>
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setstatus(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                        Bank Name:
                      </label>
                      <input
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setbankName(e.target.value)}
                        placeholder="Enter bank name (alphabets and spaces only)"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bankAccountNo" className="block text-sm font-medium text-gray-700">
                        Bank Account No:
                      </label>
                      <input
                        id="bankAccountNo"
                        value={bankAccountNo}
                        onChange={(e) => setbankAccountNo(e.target.value)}
                        placeholder="Enter your bank account number"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bankIfscCode" className="block text-sm font-medium text-gray-700">
                        Bank IFSC Code:
                      </label>
                      <input
                        id="bankIfscCode"
                        value={bankIfscCode}
                        onChange={(e) => setbankIfscCode(e.target.value.toUpperCase())}
                        placeholder="Enter IFSC code (e.g., ABCD0EF1234)"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">
                        Branch Name:
                      </label>
                      <input
                        id="branchName"
                        value={branchName}
                        onChange={(e) => setbranchName(e.target.value)}
                        placeholder="Enter branch name"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                        Salary:
                      </label>
                      <input
                        id="salary"
                        value={salary}
                        onChange={(e) => setsalary(e.target.value)}
                        placeholder="Enter salary (numeric value)"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleModalToggle}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Add Employee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Employee Modal */}
      {updateModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto relative">
            <button
              onClick={handleUpdateModalToggle}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Update Employee</h2>
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleUpdateEmp}
            >
              {/* Pre-populated update form fields – include all fields */}
              <div className="space-y-2">
                <label htmlFor="firstNameUpd" className="block text-sm font-medium text-gray-700" >
                  First Name:
                </label>
                <input
                  id="firstNameUpd"
                  value={firstName}
                  onChange={(e) => setFname(e.target.value)}
                  placeholder="First name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastNameUpd" className="block text-sm font-medium text-gray-700">
                  Last Name:
                </label>
                <input
                  id="lastNameUpd"
                  value={lastName}
                  onChange={(e) => setLname(e.target.value)}
                  placeholder="Last name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="emailUpd" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  id="emailUpd"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contactUpd" className="block text-sm font-medium text-gray-700">
                  Contact No:
                </label>
                <input
                  id="contactUpd"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contact No"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="aadharNoUpd" className="block text-sm font-medium text-gray-700">
                  Aadhar No:
                </label>
                <input
                  id="aadharNoUpd"
                  value={aadharNo}
                  onChange={(e) => setaadharNo(e.target.value)}
                  placeholder="Aadhar No"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="panCardUpd" className="block text-sm font-medium text-gray-700">
                  Pancard No:
                </label>
                <input
                  id="panCardUpd"
                  value={panCard}
                  onChange={(e) => setpanCard(e.target.value)}
                  placeholder="Enter your PAN card (e.g., ABCDE1234F)"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="educationUpd" className="block text-sm font-medium text-gray-700">
                  Education:
                </label>
                <select
                  id="educationUpd"
                  value={education}
                  onChange={(e) => seteducation(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select education</option>
                  <option value="hsc">HSC</option>
                  <option value="graduate">Graduate</option>
                  <option value="post-graduate">Post Graduate</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="bloodGroupUpd" className="block text-sm font-medium text-gray-700">
                  Blood Group:
                </label>
                <select
                  id="bloodGroupUpd"
                  value={bloodGroup}
                  onChange={(e) => setbloodGroup(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select blood group</option>
                  <option value="a+">A+</option>
                  <option value="b+">B+</option>
                  <option value="o+">O+</option>
                  <option value="ab+">AB+</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="jobRoleUpd" className="block text-sm font-medium text-gray-700">
                  Job Role:
                </label>
                <select
                  id="jobRoleUpd"
                  value={jobRole}
                  onChange={(e) => setjobRole(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select JobRole</option>
                  <option value="HR">HR</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="MERN STACK DEVELOPER">MERN STACK DEVELOPER</option>
                  <option value="SUPERVISOR">SUPERVISOR</option>
                  <option value="DIGITAL MARKETING INTERN">DIGITAL MARKETING INTERN</option>
                  <option value="JAVA FULL STACK">JAVA FULL STACK  DEVELOPER</option>
                  <option value="TELECALLER EXCUTIVE">TELECALLER EXCUTIVE</option>
                  <option value="BACK OFFICE">BACK OFFICE</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="genderUpd" className="block text-sm font-medium text-gray-700">
                  Gender:
                </label>
                <select
                  id="genderUpd"
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="addressUpd" className="block text-sm font-medium text-gray-700">
                  Address:
                </label>
                <textarea
                  id="addressUpd"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  placeholder="Address Details"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label htmlFor="birthDateUpd" className="block text-sm font-medium text-gray-700">
                  Birth Date:
                </label>
                <input
                  id="birthDateUpd"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setbirthDate(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="joiningDateUpd" className="block text-sm font-medium text-gray-700">
                  Joining Date:
                </label>
                <input
                  id="joiningDateUpd"
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setjoiningDate(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="statusUpd" className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  id="statusUpd"
                  value={status}
                  onChange={(e) => setstatus(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="bankNameUpd" className="block text-sm font-medium text-gray-700">
                  Bank Name:
                </label>
                <input
                  id="bankNameUpd"
                  value={bankName}
                  onChange={(e) => setbankName(e.target.value)}
                  placeholder="Bank Name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bankAccountNoUpd" className="block text-sm font-medium text-gray-700">
                  Bank Account No:
                </label>
                <input
                  id="bankAccountNoUpd"
                  value={bankAccountNo}
                  onChange={(e) => setbankAccountNo(e.target.value)}
                  placeholder="Account No"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bankIfscCodeUpd" className="block text-sm font-medium text-gray-700">
                  Bank IFSC Code:
                </label>
                <input
                  id="bankIfscCodeUpd"
                  value={bankIfscCode}
                  onChange={(e) => setbankIfscCode(e.target.value)}
                  placeholder="Enter IFSC code (e.g., ABCD0EF1234"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="branchNameUpd" className="block text-sm font-medium text-gray-700">
                  Branch Name:
                </label>
                <input
                  id="branchNameUpd"
                  value={branchName}
                  onChange={(e) => setbranchName(e.target.value)}
                  placeholder="Branch Name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="branchNameUpd" className="block text-sm font-medium text-gray-700">
                  salary:
                </label>
                <input
                  id="branchNameUpd"
                  value={salary}
                  onChange={(e) => setsalary(e.target.value)}
                  placeholder="Branch Name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2 flex justify-center space-x-4">
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleUpdateModalToggle}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
