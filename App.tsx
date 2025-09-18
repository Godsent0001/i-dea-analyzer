
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AnalysisData, AppState, ChatMessage } from './types';
import { analyzeIdea, continueChat } from './services/geminiService';
import Dashboard from './components/Dashboard';
import PromptForm from './components/PromptForm';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.IDLE);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleInitialSubmit = useCallback(async (prompt: string) => {
        setAppState(AppState.LOADING);
        setError(null);
        setAnalysisData(null);
        setChatHistory([]);
        try {
            const result = await analyzeIdea(prompt);
            setAnalysisData(result);
            setChatHistory([
                { role: 'user', text: prompt },
                { role: 'model', text: 'Here is your initial idea analysis. You can ask follow-up questions below.' }
            ]);
            setAppState(AppState.RESULTS);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unexpected error occurred. Please try again.');
            setAppState(AppState.ERROR);
        }
    }, []);

    const handleFollowUpSubmit = useCallback(async (prompt: string) => {
        setAppState(AppState.LOADING);
        const updatedHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: prompt }];
        setChatHistory(updatedHistory);
        setError(null);

        try {
            const result = await continueChat(updatedHistory);
            setChatHistory(prev => [...prev, { role: 'model', text: result }]);
            setAppState(AppState.RESULTS);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unexpected error occurred. Please try again.');
            setAppState(AppState.ERROR);
        }
    }, [chatHistory]);

    const renderContent = () => {
        switch (appState) {
            case AppState.LOADING:
            case AppState.IDLE:
            case AppState.ERROR:
                return (
                    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center h-full px-4">
                        <h1 className="text-5xl font-extrabold text-white mb-2 text-center">Idea Analyzer</h1>
                        <p className="text-slate-400 mb-8 text-center">Enter your business idea, and get an instant AI-powered analysis.</p>
                        <PromptForm 
                          onSubmit={handleInitialSubmit}
                          isLoading={appState === AppState.LOADING}
                          placeholder="Describe your business idea, e.g., 'An AI-powered meal planning app for busy families'..."
                        />
                         {appState === AppState.LOADING && (
                            <div className="mt-8 flex items-center text-slate-300">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing your idea... This may take a moment.
                            </div>
                        )}
                        {appState === AppState.ERROR && error && (
                            <div className="mt-4 text-red-400 bg-red-900/50 p-3 rounded-lg">
                                <strong>Error:</strong> {error}
                            </div>
                        )}
                    </div>
                );
            case AppState.RESULTS:
                if (analysisData) {
                    return (
                        <div className="w-full flex flex-col h-full">
                           <Dashboard data={analysisData} />
                           <div className="flex-grow flex flex-col bg-slate-900/50 p-4 border-t border-slate-700">
                             <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2">
                               {chatHistory.slice(1).map((msg, index) => (
                                   <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                       <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                           <p className="whitespace-pre-wrap">{msg.text}</p>
                                       </div>
                                   </div>
                               ))}
                             </div>
                             <div className="flex-shrink-0">
                               <PromptForm 
                                 onSubmit={handleFollowUpSubmit}
                                 isLoading={appState === AppState.LOADING}
                                 placeholder="Ask a follow-up question to refine your idea..."
                               />
                             </div>
                           </div>
                        </div>
                    );
                }
                return null; // Should not happen
        }
    };

    return (
        <main className="bg-slate-900 text-white min-h-screen flex flex-col">
            {renderContent()}
        </main>
    );
};

export default App;
