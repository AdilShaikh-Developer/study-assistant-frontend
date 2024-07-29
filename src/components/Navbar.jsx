import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to={"/"}>Dashboard</Link>
        </li>
        <li>
          <Link to={"/syllabus"}>Syllabus</Link>
        </li>
        <li>
          <Link to={"/assessment-archive"}>Assessment Archive</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;