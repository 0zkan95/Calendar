import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Calendar from "./components/Calendar";
import './styles/App.scss';




function App() {
  return (
    <div className="container">
      <Calendar />
    </div>
  );
}

export default App;
