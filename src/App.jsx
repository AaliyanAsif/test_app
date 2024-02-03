import React from "react";
import "./output.css";
import GroupList from "./components/GroupList";
import { Routes, Route } from "react-router-dom";
import DragableList from "./components/DragableList";

function App() {
  return (
    <div className="p-20">
      <Routes>
        <Route path="/" element={<GroupList />} />
        <Route path="dragList" element={<DragableList />} />
      </Routes>
    </div>
  );
}

export default App;
