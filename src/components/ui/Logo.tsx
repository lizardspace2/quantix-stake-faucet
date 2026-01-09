import React from 'react';

interface LogoProps {
    className?: string;
    iconClassName?: string;
    showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
    className = "",
    iconClassName = "h-10 w-10",
    showText = true
}) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`relative ${iconClassName}`}>
                <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full" />

                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full relative z-10"
                >
                    <path
                        d="M50 5L15 20V45C15 67.5 30 87.5 50 95C70 87.5 85 67.5 85 45V20L50 5Z"
                        fill="currentColor"
                        fillOpacity="0.05"
                        stroke="url(#shield_gradient_root)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M50 30C38.9543 30 30 38.9543 30 50C30 61.0457 38.9543 70 50 70C61.0457 70 70 61.0457 70 50C70 43 65 37 59 35C53 33 47 37 45 42C43 47 45 53 50 55C55 57 60 55 62 50"
                        stroke="url(#vortex_gradient_root)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{
                            transformOrigin: '50px 50px',
                            animation: 'spin 10s linear infinite'
                        }}
                    />

                    <circle cx="50" cy="50" r="4" fill="white" className="animate-pulse" />

                    <defs>
                        <linearGradient id="shield_gradient_root" x1="15" y1="5" x2="85" y2="95" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2DD4BF" />
                            <stop offset="1" stopColor="#A855F7" />
                        </linearGradient>
                        <linearGradient id="vortex_gradient_root" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2DD4BF" />
                            <stop offset="1" stopColor="#3B82F6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {showText && (
                <span className="font-bold tracking-tight text-xl">
                    QUANTIX
                </span>
            )}
        </div>
    );
};
