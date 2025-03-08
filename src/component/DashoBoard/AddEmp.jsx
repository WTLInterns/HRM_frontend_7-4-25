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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;
  const totalPages = Math.ceil(emp.length / employeesPerPage);

  useEffect(() => {
    fetchAllEmp();
  }, [addEmp, updateEmployee]);

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

  const currentEmployees = emp.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  // Validation function for all fields
  const validateFields = () => {
    // Check if any field is empty
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
    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    // Phone validation (assuming 10 digits)
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    // Aadhar validation (assuming 12 digits)
    if (!/^[0-9]{12}$/.test(aadharNo)) {
      toast.error("Please enter a valid 12-digit Aadhar number");
      return false;
    }
    // PAN Card validation (5 letters, 4 digits, 1 letter)
    if (!/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(panCard)) {
      toast.error("Please enter a valid PAN card number");
      return false;
    }
    // Salary validation (should be a positive number)
    if (isNaN(salary) || Number(salary) <= 0) {
      toast.error("Please enter a valid salary amount");
      return false;
    }
    // Bank name validation (alphabets and spaces only)
    if (!/^[A-Za-z\s]+$/.test(bankName)) {
      toast.error("Please enter a valid bank name (alphabets and spaces only)");
      return false;
    }
    // IFSC Code validation: format - 4 letters, 0, 6 alphanumeric characters (e.g., ABCD0EF1234)
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankIfscCode)) {
      toast.error("Please enter a valid IFSC code (e.g., ABCD0EF1234)");
      return false;
    }
    return true;
  };

  // Add Employee submission
  const handleAddEmp = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

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
      // Clear fields
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



const handleReset = async (e) => {
  e.preventDefault();
setFname(""),
setLname(""),
setPhone(""),
setaadharNo(""),
setaddress(""),
 setbankAccountNo(""),
 setbankIfscCode(""),
 setbankName(""), 
setbirthDate(""),
seteducation(""),
setbloodGroup(""),
setbranchName(""),
setgender(""),
setjobRole(""),
setjoiningDate(""),
setpanCard(""),
setsalary(""),
setstatus(""),
setEmail("")
}





  // Update Employee submission with validation
  const handleUpdateEmp = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

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
      console.log(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-6">EMPLOYEE MANAGEMENT</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleModalToggle}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm"
        >
          + Add Employee
        </button>
      </div>

      {/* Add Employee Modal */}
      {modal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <button
              onClick={handleModalToggle}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddEmp}>
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

              <div className="md:col-span-2 flex justify-center space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
                <button
                onClick={handleReset}
                  type="reset"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Reset
                </button>
              </div>
            </form>
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
                <label htmlFor="firstNameUpd" className="block text-sm font-medium text-gray-700">
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
                  placeholder="Pancard No"
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
                  placeholder="IFSC Code"
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

      {/* Employees Table */}
      <div className="mt-6">
        <div className="overflow-y-auto max-h-[400px]">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">First Name</th>
                <th className="border p-2">Last Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Job Role</th>
                <th className="border p-2">Phone No</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Aadhar No</th>
                <th className="border p-2">PanCard</th>
                <th className="border p-2">Education</th>
                <th className="border p-2">Blood Group</th>
                <th className="border p-2">Gender</th>
                <th className="border p-2">Birth Date</th>
                <th className="border p-2">Joining Date</th>
                <th className="border p-2">Bank Name</th>
                <th className="border p-2">Bank Account No</th>
                <th className="border p-2">IFSC Code</th>
                <th className="border p-2">Branch Name</th>
                <th className="border p-2">Salary</th>
                <th className="border p-2">Update/Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee.empId}>
                  <td className="border p-2">{employee.firstName}</td>
                  <td className="border p-2">{employee.lastName}</td>
                  <td className="border p-2">{employee.email}</td>
                  <td className="border p-2">{employee.jobRole}</td>
                  <td className="border p-2">{employee.phone}</td>
                  <td className="border p-2">{employee.status}</td>
                  <td className="border p-2">{employee.aadharNo}</td>
                  <td className="border p-2">{employee.panCard}</td>
                  <td className="border p-2">{employee.education}</td>
                  <td className="border p-2">{employee.bloodGroup}</td>
                  <td className="border p-2">{employee.gender}</td>
                  <td className="border p-2">{employee.birthDate}</td>
                  <td className="border p-2">{employee.joiningDate}</td>
                  <td className="border p-2">{employee.bankName}</td>
                  <td className="border p-2">{employee.bankAccountNo}</td>
                  <td className="border p-2">{employee.bankIfscCode}</td>
                  <td className="border p-2">{employee.branchName}</td>
                  <td className="border p-2">{employee.salary}</td>
                  <td className="border p-2 flex justify-center items-center space-x-2">
                    <CiEdit
                      onClick={() => handleEditEmp(employee)}
                      className="text-blue-500 text-xl cursor-pointer"
                    />
                    <MdDeleteOutline
                      onClick={() => handleDeleteEmp(employee.empId)}
                      className="text-red-500 text-xl cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
          >
            <FaChevronLeft />
          </button>
          <span className="px-4 py-2 text-xl">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
