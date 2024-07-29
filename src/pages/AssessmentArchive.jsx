import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";

const AssessmentArchive = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [assessments, setAssessments] = useState([]);

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(`${backendURL}/api/v1/assessments`);
      console.log(response.data.assessments);
      setAssessments(response.data.assessments);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  return (
    <div className="assessment-archive-page">
      <Navbar />
      <div className="assessment-archive-container">
        {assessments.length > 0
          ? assessments
              .sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt))
              .map((e, index) => (
                <div className="assessment-archive" key={e._id}>
                  <span>{assessments.length - index}</span>
                  <div>
                    <div>
                      <section>
                        <h5>{e.chapter}</h5>
                        <span>
                          class {e.standard}, {e.subject}
                        </span>
                        <span>
                          {`${new Date(e.createdAt)}`.substring(
                            0,
                            `${new Date(e.createdAt)}`.indexOf("GMT")
                          )}
                        </span>
                      </section>
                      <section className="score">
                        <span>
                          {e.scoreArray.reduce(
                            (accumulator, currentValue) =>
                              accumulator + currentValue
                          )}
                        </span>
                        <span className="divider"></span>
                        <span>{e.answerKey.length * 4}</span>
                      </section>
                    </div>
                    <button>
                      <Link to={`/answer-key/${e._id}`}>check Answer Key</Link>
                    </button>
                  </div>
                </div>
              ))
          : "You Don't Have Any Assessment Record"}
        {/* <div className="assessment-archive">
          <span>2</span>
          <div>
            <div>
              <section>
                <h5>Oscillation</h5>
                <span>2 June 2024, 17:17</span>
              </section>
              <section className="score">
                <span>570</span>
                <span className="divider"></span>
                <span>720</span>
              </section>
            </div>
            <button>
              <Link to={"/answer-key"}>check Answer Key</Link>
            </button>
          </div>
        </div>
        <div className="assessment-archive">
          <span>1</span>
          <div>
            <div>
              <section>
                <h5>Organic Chemistry</h5>
                <span>1 June 2024, 23:17</span>
              </section>
              <section className="score">
                <span>350</span>
                <span className="divider"></span>
                <span>720</span>
              </section>
            </div>
            <button>
              <Link to={"/answer-key"}>check Answer Key</Link>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AssessmentArchive;
