import React, { useState, useMemo, useCallback } from 'react';
import { ContentGoal, Tone, UserInputs } from '../types';
import { GOALS, TONES, GOAL_INPUT_MAP } from '../constants';
import { generateLinkedInPost } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

type Step = 'goal' | 'inputs' | 'tone' | 'result';

const PostCrafter: React.FC = () => {
    const [step, setStep] = useState<Step>('goal');
    const [selectedGoal, setSelectedGoal] = useState<ContentGoal | null>(null);
    const [userInputs, setUserInputs] = useState<UserInputs>({});
    const [selectedTone, setSelectedTone] = useState<Tone | null>(null);
    const [generatedPost, setGeneratedPost] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const inputFields = useMemo(() => {
        if (!selectedGoal) return [];
        return GOAL_INPUT_MAP[selectedGoal];
    }, [selectedGoal]);

    const handleGoalSelect = (goal: ContentGoal) => {
        setSelectedGoal(goal);
        setUserInputs({}); // Reset inputs when goal changes
        setStep('inputs');
    };
    
    const handleInputChange = (key: string, value: string) => {
        setUserInputs(prev => ({ ...prev, [key]: value }));
    };

    const handleBack = () => {
        if (step === 'result') setStep('tone');
        else if (step === 'tone') setStep('inputs');
        else if (step === 'inputs') setStep('goal');
    };

    const handleGenerate = useCallback(async () => {
        if (!selectedGoal || !selectedTone || Object.values(userInputs).some(v => !v)) {
            setError("Please fill in all required fields.");
            return;
        }
        setError(null);
        setIsLoading(true);
        setGeneratedPost('');

        try {
            const post = await generateLinkedInPost(selectedGoal, userInputs, selectedTone);
            setGeneratedPost(post);
            setStep('result');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedGoal, selectedTone, userInputs]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedPost);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleStartOver = () => {
        setStep('goal');
        setSelectedGoal(null);
        setUserInputs({});
        setSelectedTone(null);
        setGeneratedPost('');
        setError(null);
    };
    
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-brand-gray-200">
            {step !== 'goal' && (
                <button onClick={handleBack} className="flex items-center gap-2 text-sm text-brand-blue font-semibold mb-6 hover:underline">
                    <ArrowLeftIcon />
                    Back
                </button>
            )}
            
            {step === 'goal' && <GoalSelector onSelect={handleGoalSelect} />}
            
            {step === 'inputs' && selectedGoal && (
                <InputFields goal={selectedGoal} inputs={userInputs} onChange={handleInputChange} onNext={() => setStep('tone')} />
            )}
            
            {step === 'tone' && (
                <ToneSelector 
                    onSelect={setSelectedTone} 
                    onNext={handleGenerate} 
                    isLoading={isLoading}
                />
            )}
            
            {step === 'result' && (
                <GeneratedPost post={generatedPost} error={error} onCopy={handleCopy} isCopied={isCopied} onStartOver={handleStartOver} />
            )}
        </div>
    );
};

// Sub-components defined outside PostCrafter to prevent re-creation on re-renders
const StepHeader: React.FC<{ number: number; title: string; subtitle: string }> = ({ number, title, subtitle }) => (
    <div className="mb-8">
        <h2 className="text-sm font-bold text-brand-blue uppercase tracking-wide">Step {number}</h2>
        <h3 className="text-3xl font-bold text-brand-gray-900 mt-1">{title}</h3>
        <p className="text-brand-gray-500 mt-2">{subtitle}</p>
    </div>
);

const GoalSelector: React.FC<{ onSelect: (goal: ContentGoal) => void }> = ({ onSelect }) => (
    <>
        <StepHeader number={1} title="Choose Your Content Goal" subtitle="What kind of impact do you want to make with this post?" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GOALS.map(goal => (
                <button key={goal} onClick={() => onSelect(goal)} className="p-6 text-left bg-brand-gray-50 rounded-xl hover:bg-brand-gray-100 hover:shadow-md transition-all duration-200 border border-brand-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                    <p className="font-semibold text-brand-gray-800">{goal}</p>
                </button>
            ))}
        </div>
    </>
);

interface InputFieldsProps {
    goal: ContentGoal;
    inputs: UserInputs;
    onChange: (key: string, value: string) => void;
    onNext: () => void;
}
const InputFields: React.FC<InputFieldsProps> = ({ goal, inputs, onChange, onNext }) => {
    const fields = GOAL_INPUT_MAP[goal];
    const isNextDisabled = fields.some(field => field.key !== 'stance' && field.key !== 'thanks' && !inputs[field.key]);

    return (
        <>
            <StepHeader number={2} title="Provide Key Inputs" subtitle="Give the AI the essential 'ingredients' for your post." />
            <div className="space-y-6">
                {fields.map(({ label, placeholder, key, type }) => (
                    <div key={key}>
                        <label className="block text-sm font-medium text-brand-gray-700 mb-1">{label}</label>
                        {type === 'textarea' ? (
                            <textarea
                                value={inputs[key] || ''}
                                onChange={(e) => onChange(key, e.target.value)}
                                placeholder={placeholder}
                                rows={3}
                                className="w-full p-3 bg-white border border-brand-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition-colors text-brand-gray-800"
                            />
                        ) : (
                            <input
                                type="text"
                                value={inputs[key] || ''}
                                onChange={(e) => onChange(key, e.target.value)}
                                placeholder={placeholder}
                                className="w-full p-3 bg-white border border-brand-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue transition-colors text-brand-gray-800"
                            />
                        )}
                    </div>
                ))}
            </div>
            <button onClick={onNext} disabled={isNextDisabled} className="w-full mt-8 bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-brand-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                Continue to Tone Selection
            </button>
        </>
    );
};

interface ToneSelectorProps {
    onSelect: (tone: Tone) => void;
    onNext: () => void;
    isLoading: boolean;
}
const ToneSelector: React.FC<ToneSelectorProps> = ({ onSelect, onNext, isLoading }) => {
    const [selected, setSelected] = useState<Tone | null>(null);

    const handleSelect = (tone: Tone) => {
        setSelected(tone);
        onSelect(tone);
    }
    
    return (
        <>
            <StepHeader number={3} title="Select a Tone of Voice" subtitle="How do you want to sound to your audience?" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TONES.map(tone => (
                    <button 
                        key={tone} 
                        onClick={() => handleSelect(tone)} 
                        className={`p-6 text-left rounded-xl transition-all duration-200 border ${selected === tone ? 'bg-blue-100 border-brand-blue ring-2 ring-brand-blue' : 'bg-brand-gray-50 border-brand-gray-200 hover:bg-brand-gray-100'}`}
                    >
                        <p className="font-semibold text-brand-gray-800">{tone}</p>
                    </button>
                ))}
            </div>

            <button onClick={onNext} disabled={!selected || isLoading} className="w-full mt-8 bg-brand-blue text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-brand-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg">
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Crafting...</span>
                    </>
                ) : (
                    <>
                        <SparklesIcon />
                        Generate Post
                    </>
                )}
            </button>
        </>
    );
};

interface GeneratedPostProps {
    post: string;
    error: string | null;
    onCopy: () => void;
    isCopied: boolean;
    onStartOver: () => void;
}
const GeneratedPost: React.FC<GeneratedPostProps> = ({ post, error, onCopy, isCopied, onStartOver }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-gray-900 mb-4">Your LinkedIn Post is Ready!</h2>

            {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Oops! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : (
                <div className="bg-brand-gray-50 border border-brand-gray-200 rounded-lg p-6 whitespace-pre-wrap font-sans text-brand-gray-800">
                    {post}
                </div>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                {!error && (
                    <button 
                        onClick={onCopy} 
                        className="w-full sm:w-auto flex-1 bg-brand-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {isCopied ? <CheckIcon /> : <ClipboardIcon />}
                        {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                )}
                <button 
                    onClick={onStartOver} 
                    className="w-full sm:w-auto flex-1 bg-brand-gray-200 text-brand-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-brand-gray-300 transition-colors"
                >
                    Create a New Post
                </button>
            </div>
        </div>
    );
}


export default PostCrafter;