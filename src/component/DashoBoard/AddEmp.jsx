import { useEffect, useState } from "react";
// import { useApp } from "../../context/AppContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useApp } from "../../context/AppContext";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

import {
  FaCalendarWeek,
  FaReceipt,
  FaRegCalendarCheck,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaTimes, // Added for close icon
} from "react-icons/fa";

export default function AddEmp() {
  const { addEmp, fetchAllEmp, emp, deleteEmployee } = useApp();

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
  const [modal, setModal] = useState(false);

  const [salary, setsalary] = useState("");
  const [bankAccountNo, setbankAccountNo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const totalPages = Math.ceil(emp.length / employeesPerPage);

  // const { fetchAllEmp, emp } = useApp();

  useEffect(() => {
    fetchAllEmp();
  }, [addEmp]);

  const handleModalToggle = () => {
    setModal(!modal);
  };

  const currentEmployees = emp.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  const handleAddEmp = async (e) => {
    e.preventDefault();

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
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error("Email is already existed");
      } else {
        toast.error("Failed to register user");
      }
    }
  };

  const handleDeleteEmp = async (empId) => {
    try {
      await deleteEmployee(empId);
      toast.success("Employee deleted successfully");
      fetchAllEmp();
    } catch (err) {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-6">ADD NEW EMPLOYEE</h1>

      <div className="flex justify-end">
        <button
          onClick={handleModalToggle}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          + Add Employee
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
            <button
              onClick={handleModalToggle}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleAddEmp}
            >
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name:
                </label>
                <input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFname(e.target.value)}
                  placeholder="First name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name:
                </label>
                <input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLname(e.target.value)}
                  placeholder="Last name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email ID:
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact No:
                </label>
                <input
                  id="contact"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contact No"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="aadharNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Aadhar No:
                </label>
                <input
                  id="aadharNo"
                  value={aadharNo}
                  onChange={(e) => setaadharNo(e.target.value)}
                  placeholder="Aadhar No"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="panCard"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pancard No:
                </label>
                <input
                  id="panCard"
                  value={panCard}
                  onChange={(e) => setpanCard(e.target.value)}
                  placeholder="PanCard No"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="education"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="jobRole"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Role:
                </label>
                <select
                  id="jobRole"
                  value={jobRole}
                  onChange={(e) => setjobRole(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select JobRole</option>
                  <option value="HR">HR</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="FRONTEND DEVELOPER">FRONTEND DEVELOPER</option>
                  <option value="BACKEND DEVELOPER">BACKEND DEVELOPER</option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address:
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setaddress(e.target.value)}
                  placeholder="Address Details"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Birth Date:
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setbirthDate(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="joiningDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Joining Date:
                </label>
                <input
                  id="joiningDate"
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setjoiningDate(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="bankName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Name:
                </label>
                <input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setbankName(e.target.value)}
                  placeholder="Bank Name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="bankAccountNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Account No:
                </label>
                <input
                  id="bankAccountNo"
                  value={bankAccountNo}
                  onChange={(e) => setbankAccountNo(e.target.value)}
                  placeholder="Account No"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="bankIfscCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank IFSC Code:
                </label>
                <input
                  id="bankIfscCode"
                  value={bankIfscCode}
                  onChange={(e) => setbankIfscCode(e.target.value)}
                  placeholder="IFSC Code"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="branchName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Branch Name:
                </label>
                <input
                  id="branchName"
                  value={branchName}
                  onChange={(e) => setbranchName(e.target.value)}
                  placeholder="Branch Name"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Salary:
                </label>
                <input
                  id="salary"
                  value={salary}
                  onChange={(e) => setsalary(e.target.value)}
                  placeholder="Salary"
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
                  <td className="border p-2 flex justify-center items-center">
                    {/* <CiEdit className="text-blue-500 text-xl cursor-pointer mr-2" /> */}
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
