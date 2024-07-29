import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Syllabus = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [standard, setStandard] = useState(11);
  const [subject, setSubject] = useState("physics");
  const [syllabus, setSyllabus] = useState();
  const date = new Date();

  const fetchSyllabus = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/v1/syllabus`);

      response.data.syllabus.filter((e) => {
        e.classNumber == standard
          ? e.subjects.filter((e) =>
              e.subject === subject ? setSyllabus(e.chapters) : ""
            )
          : "";
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addToTask = async (e) => {
    const confirmationMessage = confirm(
      "Are you sure you want to add this chapter to task list?"
    );

    if (confirmationMessage) {
      try {
        const chapterId = e.currentTarget.attributes.value.value;

        const response = await axios.patch(
          `${backendURL}/api/v1/syllabus/add-to-task`,
          {
            standard,
            subject,
            chapterId,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const removeFromTask = async (e) => {
    const confirmationMessage = confirm(
      "Are you sure you want to remove this chapter from task list?"
    );

    if (confirmationMessage) {
      try {
        const chapterId = e.currentTarget.attributes.value.value;

        const response = await axios.patch(
          `${backendURL}/api/v1/syllabus/remove-from-task`,
          {
            standard,
            subject,
            chapterId,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, [standard, subject, addToTask, removeFromTask]);

  return (
    <div className="syllabus-page">
      <Navbar />
      <div className="syllabus-section">
        <div className="subjects">
          <span
            onClick={() => setSubject("physics")}
            className={subject === "physics" ? "active" : ""}
          >
            Physics
          </span>
          <span
            onClick={() => setSubject("chemistry")}
            className={subject === "chemistry" ? "active" : ""}
          >
            Chemistry
          </span>
          <span
            onClick={() => setSubject("zoology")}
            className={subject === "zoology" ? "active" : ""}
          >
            Zoology
          </span>
          <span
            onClick={() => setSubject("botany")}
            className={subject === "botany" ? "active" : ""}
          >
            Botany
          </span>
        </div>
        <select onChange={(e) => setStandard(e.currentTarget.value)}>
          <option value="11">11th</option>
          <option value="12">12th</option>
        </select>
        <div className="content-container">
          {syllabus ? (
            <table>
              <thead>
                <tr>
                  <td>Question Count (Last Year)</td>
                  <td>Chapter Name</td>
                  <td>Status</td>
                  <td>Task Age</td>
                </tr>
              </thead>
              <tbody>
                {syllabus.map((e) => (
                  <tr key={e._id}>
                    <td>{e.questionCount}</td>
                    <td>{e.name}</td>
                    <td>{e.status}</td>
                    <td>
                      {e.status !== "In Progress"
                        ? `${e.taskAge}`.substring(0, 5)
                        : Math.round(
                            (date - e.taskAge) / (1000 * 60 * 60 * 24)
                          )}{" "}
                      Days
                    </td>
                    {e.status === "Not Yet Started" ? (
                      <td value={e._id} onClick={addToTask}>
                        Add to Todo's
                      </td>
                    ) : e.status === "In Progress" ? (
                      <td value={e._id} onClick={removeFromTask}>
                        Remove to Todo's
                      </td>
                    ) : (
                      ""
                    )}
                    <td>
                      <Link
                        to={`/examination-portal/${standard}/${subject}/${e.name}`}
                      >
                        Take a Assissment
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
