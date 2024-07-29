import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import { CiTimer } from "react-icons/ci";

const ExaminationPortal = () => {
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { standard, subject, chapterName } = useParams();

  const [problem, setProblem] = useState([]);
  const [problemIndex, setProblemIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  const [answerKey, setAnswerKey] = useState(false);

  const [intervalId, setIntervalId] = useState(false);

  const fetchProblems = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/api/v1/syllabus/practice-problems/${standard}/${subject}/${chapterName}`
      );

      setProblem(response.data.response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNext = () => {
    setProblemIndex((prev) =>
      prev >= problem.length - 1 ? (prev = 0) : prev + 1
    );
  };
  const handlePrev = () => {
    setProblemIndex((prev) =>
      prev <= 0 ? (prev = problem.length - 1) : prev - 1
    );
  };

  const handleStartButton = async () => {
    const confirmation = confirm("do you want to start the assisment?");
    if (confirmation) {
      try {
        const response = await axios.post(
          `${backendURL}/api/v1/assessments/create`,
          {
            standard,
            subject,
            chapterName,
            problemLength: problem.length,
          }
        );

        setIsStarted(true);
        setAnswerKey(response.data.response.answerKey);
        manageAssessment(response.data.response.endedAt);
        Cookies.set("Assessment-ID", response.data.response._id, {
          expires: problem.length / 1440,
        });
      } catch (error) {}
    }
  };

  const handleEndButton = async () => {
    const confirmation = confirm("are you sure do you want to end assessment?");
    if (confirmation) {
      const response = await axios.patch(
        `${backendURL}/api/v1/assessments/end`,
        { id: Cookies.get("Assessment-ID"), endedAt: new Date() }
      );

      console.log(response);
      Cookies.remove("Assessment-ID");
      setIsStarted(false);
      clearInterval(intervalId);
      navigate("/");
    }
  };

  const handleOptionClick = async (e) => {
    if (isStarted) {
      try {
        const response = await axios.patch(
          `${backendURL}/api/v1/assessments/update-answer`,
          {
            id: Cookies.get("Assessment-ID"),
            studentAnswer: Number(e.currentTarget.attributes.index.value),
            problemIndex,
            currentQuestionScore:
              problem[problemIndex].correctOption ===
              Number(e.currentTarget.attributes.index.value)
                ? 4
                : -1,
          }
        );

        setAnswerKey(response.data.answerKey);
      } catch (error) {}
    }
  };

  const manageAssessment = (endDate) => {
    const intervalID = setInterval(() => {
      const start = new Date();
      const end = new Date(endDate).getTime();

      const difference = end - start;

      if (difference <= 0) {
        Cookies.remove("Assessment-ID");
        setIsStarted(false);
        setHour(0);
        setMinute(0);
        setSecond(0);
        clearInterval(intervalId);
        navigate("/");
      }

      setHour(Math.floor(difference / (1000 * 60 * 60)));
      setMinute(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
      setSecond(Math.floor((difference % (1000 * 60)) / 1000));
    }, 1000);
    setIntervalId(intervalID);
  };

  const fetchAssessment = async (id) => {
    const response = await axios.get(`${backendURL}/api/v1/assessments/${id}`);
    setAnswerKey(response.data.assessment.answerKey);

    manageAssessment(response.data.assessment.endedAt);
  };

  useEffect(() => {
    fetchProblems();

    if (Cookies.get("Assessment-ID") !== undefined) {
      setIsStarted(true);
      fetchAssessment(Cookies.get("Assessment-ID"));
    } else setIsStarted(false);
  }, []);

  return (
    <div className="examination-portal-page">
      <div className="header">
        <div className="timer">
          <CiTimer />
          <section>
            <span>Time Remaining</span>
            <span>{`${hour < 10 ? `0${hour}` : hour} : ${
              minute < 10 ? `0${minute}` : minute
            } : ${second < 10 ? `0${second}` : second}`}</span>
          </section>
        </div>
        {isStarted ? (
          <button onClick={handleEndButton}>End</button>
        ) : problem.length <= 0 ? (
          <button>Start</button>
        ) : (
          <button onClick={handleStartButton}>Start</button>
        )}
      </div>
      <div className="body">
        <div className="questions">
          <span>{`Question ${problemIndex + 1} of ${problem.length}`}</span>
          {problem.length !== 0 ? (
            <div
              className="question"
              dangerouslySetInnerHTML={{
                __html: `${problem[problemIndex].question}`,
              }}
            ></div>
          ) : (
            "Currently Questions Are Not Available"
          )}
          <div className="options">
            <ol>
              {problem.length !== 0
                ? problem[problemIndex].options.map((e, index) => (
                    <li
                      key={index}
                      index={index}
                      onClick={handleOptionClick}
                      className={
                        answerKey
                          ? answerKey[problemIndex] === index
                            ? "active"
                            : ""
                          : ""
                      }
                    >
                      {e}
                    </li>
                  ))
                : ""}
            </ol>
          </div>
        </div>
        {problem.length !== 0 ? (
          <div
            className="question-status-bar"
            style={{
              background: `conic-gradient(#4d5bf9 ${
                (problemIndex / (problem.length - 1)) * 100 * 3.6
              }deg, #cadcff ${
                (problemIndex / (problem.length - 1)) * 100 * 3.6
              }deg)`,
            }}
          >
            <div className="questions-status">
              <span>{problemIndex + 1}</span>
              <span className="divider"></span>
              <span>{problem.length}</span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="footer">
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default ExaminationPortal;
