import { IconProps } from "@/types";

export function ArrowLeftIcon({
    className,
    color = "#92998E",
    size = 18,
}: IconProps) {
    return (
        <svg 
            width={size}
            height={size}
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path d="M7.99992 12.6666L3.33325 7.99998L7.99992 3.33331" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.6666 8H3.33325" stroke={color} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>        
    );
}