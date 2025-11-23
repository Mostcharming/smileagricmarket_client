import { LogoIcon } from "@/components/icons";

export default function Loading() {
  return (
    <div className="w-full h-full fixed flex items-center justify-center bg-background z-99999">
      <div className="animate-pulse">
        <LogoIcon className="w-[50px]!" />
      </div>
    </div>
  );
} 