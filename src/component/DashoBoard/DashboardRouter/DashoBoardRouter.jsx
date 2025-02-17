import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../DashBoard";
import AddEmp from "../AddEmp";

const DashoBoardRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/addEmp" element={<AddEmp />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </>
  );
};

export default DashoBoardRouter;
