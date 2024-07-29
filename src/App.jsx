import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";

import "./stylesheets/app.scss";
import Syllabus from "./pages/Syllabus.jsx";
import AssessmentArchive from "./pages/AssessmentArchive.jsx";
import ExaminationPortal from "./pages/ExaminationPortal.jsx";
import AnswerKey from "./pages/AnswerKey.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/assessment-archive" element={<AssessmentArchive />} />
        <Route
          path="/examination-portal/:standard/:subject/:chapterName"
          element={<ExaminationPortal />}
        />
        <Route path="/answer-key/:id" element={<AnswerKey />} />
      </Routes>
    </Router>
  );
};

export default App;
