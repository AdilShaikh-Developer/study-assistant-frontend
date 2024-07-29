import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";

const AnswerKey = () => {
  const { id } = useParams();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [problems, setProblems] = useState([]);
  const [assessment, setAssessment] = useState(false);

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/api/v1/assessments/${id}`
      );
      console.log(response.data.assessment);
      setAssessment(response.data.assessment);

      const problems = await axios.get(
        `${backendURL}/api/v1/syllabus/practice-problems/${response.data.assessment.standard}/${response.data.assessment.subject}/${response.data.assessment.chapter}`
      );

      setProblems(problems.data.response);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <div className="answer-key-page">
      <Navbar />
      {assessment ? (
        <div className="assessment-details">
          <div>
            <h5>{assessment.chapter}</h5>
            <span>
              {`${new Date(assessment.createdAt)}`.substring(
                0,
                `${new Date(assessment.createdAt)}`.indexOf("GMT")
              )}
            </span>
          </div>
          <span>Total Questions: {assessment.answerKey.length}</span>
          <span className="not-attempted">
            {assessment.scoreArray.filter((e) => e === 0).length} Not Attempted
          </span>
          <span className="correct">
            {assessment.scoreArray.filter((e) => e === 4).length} Correct
          </span>
          <span className="wrong">
            {assessment.scoreArray.filter((e) => e === -1).length} Wrong
          </span>
          <span>
            Score:{" "}
            {assessment.scoreArray.reduce(
              (accumulator, currentValue) => accumulator + currentValue
            )}{" "}
            out of {assessment.scoreArray.length * 4}
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="answer-key-container">
        <div className="answer-key">
          {problems.length > 0
            ? problems.map((e, problemIndex) => (
                <div className="questions" key={e._id}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${1 + problemIndex}. ${e.question}`,
                    }}
                  ></div>
                  <div className="options">
                    <ol>
                      {e.options.map((e, optionIndex) => (
                        <li
                          key={optionIndex}
                          className={
                            assessment.scoreArray[problemIndex] === 0
                              ? problems[problemIndex].correctOption ===
                                optionIndex
                                ? "not-attempted"
                                : ""
                              : assessment.scoreArray[problemIndex] === 4
                              ? problems[problemIndex].correctOption ===
                                optionIndex
                                ? "correct"
                                : ""
                              : assessment.scoreArray[problemIndex] === -1
                              ? assessment.answerKey[problemIndex] ===
                                optionIndex
                                ? "wrong"
                                : problems[problemIndex].correctOption ===
                                  optionIndex
                                ? "correct"
                                : ""
                              : ""
                          }
                        >
                          {e}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))
            : ""}
          {/* <div>
              Q.10 A logic circuit provides the output Y as per the following
              truth table :
              <table>
                <thead>
                  <tr>
                    <td>A</td>
                    <td>B</td>
                    <td>Y</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
              The expression for the output Y is :
            </div>
            <div className="options">
              <ol>
                <li className="wrong">AB + Ā</li>
                <li>AB̅ + Ā</li>
                <li className="correct">B̅</li>
                <li>B</li>
              </ol>
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default AnswerKey;
