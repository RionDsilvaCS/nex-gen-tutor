import React, { createContext, useState } from 'react';
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from "./pages/Home/Home"
import Chat from "./components/ChatApp/ChatApp"
import Model from "./react3/model"
import DocUploadViewer from './components/Document/Document';


export const ChatContext = createContext();


const App = () => {
  const [physicsChatMessages, setPhysicsChatMessages] = useState(() => {
    const savedPhysicsMessages = localStorage.getItem('physicsChatMessages');
    return savedPhysicsMessages ? JSON.parse(savedPhysicsMessages) : [];
  });

  const [chemistryChatMessages, setChemistryChatMessages] = useState(() => {
    const savedChemistryMessages = localStorage.getItem('chemistryChatMessages');
    return savedChemistryMessages ? JSON.parse(savedChemistryMessages) : [];
  });

  const [biologyChatMessages, setBiologyChatMessages] = useState(() => {
    const savedBiologyMessages = localStorage.getItem('biologyChatMessages');
    return savedBiologyMessages ? JSON.parse(savedBiologyMessages) : [];
  });

  return (
    <ChatContext.Provider
      value={{
        physicsChatMessages,
        setPhysicsChatMessages,
        chemistryChatMessages,
        setChemistryChatMessages,
        biologyChatMessages,
        setBiologyChatMessages,
      }}
    >
      <Router>
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:subject" element={<Model />} />
            <Route path="/document" element={<DocUploadViewer/>} />
          </Routes>
        </div>
      </Router>
    </ChatContext.Provider>
  );
};

export default App;
