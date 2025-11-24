import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { Typography } from "@/components/ui";


export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="w-full flex flex-col items-center justify-center gap-6">
          <Link href="/" className="w-fit flex items-center gap-2">
            <ArrowLeftIcon size={20} color="var(--primary100)" />
            <Typography variant="normal" className="text-primary100 font-semibold">Go back</Typography>
          </Link>
          <div className="w-[90%] md:w-full max-w-md max-h-[80vh] flex flex-col items-center bg-appWhite shadow-sm shadow-[#0C0C0D0D] rounded-lg p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }