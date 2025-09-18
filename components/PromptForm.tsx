
import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';

interface PromptFormProps {
    onSubmit: (prompt: string) => void;
    isLoading: boolean;
    placeholder: string;
}

const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading, placeholder }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSubmit(prompt.trim());
            setPrompt('');
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full relative">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg text-white p-4 pr-16 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                rows={1}
                disabled={isLoading}
            />
            <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </form>
    );
};

export default PromptForm;
