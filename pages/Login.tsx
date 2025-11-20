import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../components/Icons';

export const Login = () => {
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            login(email);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm border border-zinc-800 rounded-lg p-8 mb-4 bg-black">
                <h1 className="text-4xl font-bold italic text-center mb-8 font-serif">InstaGemini</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input 
                        type="text" 
                        placeholder="Phone number, username, or email" 
                        className="bg-zinc-900 border border-zinc-800 rounded p-3 text-xs focus:outline-none focus:border-zinc-600 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="bg-zinc-900 border border-zinc-800 rounded p-3 text-xs focus:outline-none focus:border-zinc-600 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        disabled={!email || !password}
                        className="bg-blue-500 text-white rounded py-2 font-semibold text-sm disabled:opacity-50 hover:bg-blue-600 transition-colors"
                    >
                        Log in
                    </button>
                </form>
                
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-zinc-800"></div>
                    <span className="px-4 text-zinc-500 text-xs font-semibold">OR</span>
                    <div className="flex-1 h-px bg-zinc-800"></div>
                </div>

                <div className="flex justify-center items-center space-x-2 text-blue-500 text-sm font-semibold cursor-pointer mb-4">
                    <Icons.Activity className="w-5 h-5" />
                    <span>Log in with Facebook</span>
                </div>
                
                <div className="text-center text-xs text-white cursor-pointer">Forgot password?</div>
            </div>

            <div className="w-full max-w-sm border border-zinc-800 rounded-lg p-6 bg-black text-center text-sm">
                <span className="text-white">Don't have an account? </span>
                <span className="text-blue-500 font-semibold cursor-pointer" onClick={() => login('guest')}>Sign up</span>
            </div>
        </div>
    );
};