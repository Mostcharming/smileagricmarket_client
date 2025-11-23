import { IconProps } from "@/types/shared.types";

export function EyeOffIcon({
    className,
    color = "#92998E",
    size = 20,
}: IconProps) {
    return (
        <svg 
            width={size}
            height={size}
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="2" y1="2" x2="22" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>        
    );
}
