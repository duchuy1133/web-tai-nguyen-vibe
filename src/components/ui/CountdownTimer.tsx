'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateTimer = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0); // Next Midnight

            const diff = midnight.getTime() - now.getTime();

            if (diff <= 0) {
                // Determine logic for next day or stop? 
                // Creating a loop for "End of Today" means it resets every day, which is good suitable "FOMO"
                midnight.setDate(midnight.getDate() + 1);
            }

            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft({ hours: h, minutes: m, seconds: s });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) return <div className="h-16 animate-pulse bg-slate-800/50 rounded-lg mb-6"></div>;

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900 border border-orange-500/30 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent opacity-50" />
                <span className="text-xl sm:text-2xl font-bold text-white font-mono relative z-10">
                    {value.toString().padStart(2, '0')}
                </span>
            </div>
            <span className="text-[10px] sm:text-xs text-orange-400 font-medium mt-1 uppercase tracking-wider">{label}</span>
        </div>
    );

    return (
        <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3 animate-bounce-slow">
                <span className="text-orange-500">🔥</span>
                <span className="text-sm font-bold text-orange-400 uppercase tracking-widest">Ưu đãi kết thúc sau:</span>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4">
                <TimeUnit value={timeLeft.hours} label="Giờ" />
                <span className="text-2xl font-bold text-slate-600 -mt-4">:</span>
                <TimeUnit value={timeLeft.minutes} label="Phút" />
                <span className="text-2xl font-bold text-slate-600 -mt-4">:</span>
                <TimeUnit value={timeLeft.seconds} label="Giây" />
            </div>
        </div>
    );
}
