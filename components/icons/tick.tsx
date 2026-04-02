import { IconProps } from "@/types";

export const TickIcon = ({ 
    size = 20, 
    color = "#64B03F", 
    className = ""
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <mask
      id="mask0_2507_10196"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width={size}
      height={size}
    >
    <rect width={size} height={size} rx="10" fill="white"/>
    </mask>
    <g mask="url(#mask0_2507_10196)">
    <rect width={size} height={size} fill={color}/>
    </g>
    <g filter="url(#filter0_d_2507_10196)">
    <path fillRule="evenodd" clipRule="evenodd" d="M14.7917 6.2358C15.0798 6.53914 15.0675 7.01865 14.7642 7.30682L8.7036 13.0644C8.40574 13.3474 7.93663 13.3413 7.64613 13.0508L5.22189 10.6266C4.92604 10.3307 4.92604 9.85107 5.22189 9.55522C5.51774 9.25937 5.99741 9.25937 6.29326 9.55522L8.19538 11.4573L13.7206 6.20834C14.024 5.92016 14.5035 5.93246 14.7917 6.2358Z" fill="white"/>
    </g>
    <defs>
    <filter id="filter0_d_2507_10196" x="3" y="5" width="14" height="11.2725" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="1"/>
    <feGaussianBlur stdDeviation="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.266667 0 0 0 0 0.337255 0 0 0 0 0.423529 0 0 0 0.15 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2507_10196"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2507_10196" result="shape"/>
    </filter>
    </defs>
  </svg>
);
