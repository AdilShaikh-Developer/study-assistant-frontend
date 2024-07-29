import React, { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";

import heroImage from "../assets/a07bed201a221f98f6ee8df37900e26c-removebg-preview.png";

import { CiTrash } from "react-icons/ci";
import { FcCheckmark } from "react-icons/fc";

const Dashboard = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [tasks, setTasks] = useState([]);
  const [updateData, setUpdateData] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/v1/syllabus`);

      const arrayOfTasks = [];

      response.data.syllabus.forEach((element) => {
        const standard = element.classNumber;
        element.subjects.forEach((element) => {
          const subject = element.subject;
          const filterChapters = element.chapters.filter((element) => {
            element.standard = standard;
            element.subject = subject;
            return element.status === "In Progress";
          });
          arrayOfTasks.push(...filterChapters);
        });
      });
      setTasks(arrayOfTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromTask = async (e) => {
    const confirmationMessage = confirm(
      "Are you sure you want to remove this chapter from task list?"
    );

    if (confirmationMessage) {
      try {
        const { chapterid, standard, subject } = e.currentTarget.attributes;

        const response = await axios.patch(
          `${backendURL}/api/v1/syllabus/remove-from-task`,
          {
            standard: standard.value,
            subject: subject.value,
            chapterId: chapterid.value,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
    setUpdateData((prev) => !prev);
  };

  const completeTask = async (e) => {
    const confirmationMessage = confirm(
      "Are you sure you want to mark this chapter as completed?"
    );

    if (confirmationMessage) {
      try {
        const { chapterid, standard, subject } = e.currentTarget.attributes;

        const response = await axios.patch(
          `${backendURL}/api/v1/syllabus/complete-task`,
          {
            standard: standard.value,
            subject: subject.value,
            chapterId: chapterid.value,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
    setUpdateData((prev) => !prev);
  };

  useEffect(() => {
    fetchTasks();
    console.log("Dashboard USE Effect");
  }, [updateData]);

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="hero-section">
        <div className="greeting">
          <h3>
            Welcome Back, <span>Shaikh Adil!</span>
          </h3>
          <span>Your hard work and dedication will pay off in the end.</span>
        </div>
        <img src={heroImage} alt="" />
      </div>
      <div className="todo-list-section">
        <div className="todo-list">
          <div className="todo-list-header">
            <span>{`${`${new Date()}`.substring(
              0,
              `${new Date()}`.indexOf(" ")
            )}, ${`${new Date()}`.substring(
              `${new Date()}`.indexOf(" "),
              `${new Date()}`.indexOf(" GMT") - 9
            )}`}</span>
          </div>
          <div className="todo-list-body">
            <ol>
              {tasks.length != 0
                ? tasks.map((e, index) => (
                    <li key={index}>
                      <div>
                        <span>{1 + index}.</span>
                        <span>
                          {e.name} <br />
                          <span>
                            class {e.standard}, {e.subject}
                          </span>
                        </span>
                      </div>
                      <div>
                        <FcCheckmark
                          type="checkbox"
                          chapterid={e._id}
                          standard={e.standard}
                          subject={e.subject}
                          onClick={completeTask}
                        />
                        <CiTrash
                          chapterid={e._id}
                          standard={e.standard}
                          subject={e.subject}
                          onClick={removeFromTask}
                        />
                      </div>
                    </li>
                  ))
                : "Your task list is empty. Start adding tasks to stay organized!"}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
