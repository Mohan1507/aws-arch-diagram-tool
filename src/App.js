import React, { useState } from 'react';
import InputPanel from './components/InputPanel';
import ChatPanel from './components/ChatPanel';
import DiagramCanvas from './components/DiagramCanvas';
import Toolbar from './components/Toolbar';
import './App.css';

function App() {
  const [step, setStep] = useState('input');
  const [sowText, setSowText] = useState('');
  const [architecture, setArchitecture] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <span className="header-icon">☁️</span>
          <div>
            <h1>AWS Architecture Diagram Tool</h1>
            <p>Transform your SOW into a visual architecture diagram</p>
          </div>
        </div>
        <div className="header-steps">
          <div className={`step ${step === 'input' ? 'active' : step !== 'input' ? 'done' : ''}`}>
            <span>1</span> Input
          </div>
          <div className="step-divider" />
          <div className={`step ${step === 'chat' ? 'active' : step === 'diagram' ? 'done' : ''}`}>
            <span>2</span> Clarify
          </div>
          <div className="step-divider" />
          <div className={`step ${step === 'diagram' ? 'active' : ''}`}>
            <span>3</span> Diagram
          </div>
        </div>
      </header>

      <main className="app-main">
        {step === 'input' && (
          <InputPanel
            sowText={sowText}
            setSowText={setSowText}
            setStep={setStep}
            setArchitecture={setArchitecture}
            setChatHistory={setChatHistory}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        )}
        {step === 'chat' && (
          <ChatPanel
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            architecture={architecture}
            setArchitecture={setArchitecture}
            setStep={setStep}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
        {step === 'diagram' && (
          <div className="diagram-layout">
            <Toolbar architecture={architecture} />
            <DiagramCanvas architecture={architecture} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
