'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/icons";
import { Button, Typography, Input } from "@/components/ui";
import { toast } from "sonner";
import { setCookie, setStoredUser, setStoredRole } from "@/utils";
import { useMarketingLogin } from "@/mutation";

const MarketingLogin = () => {
  const router = useRouter();
  const { mutate, isPending } = useMarketingLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    mutate(
      { email, password },
      {
        onSuccess: async (response) => {
          toast.success("Marketing login successful!");
          setCookie(response.data.token);
          const role = response.data.marketingAdmin.role || 'marketing';
          setStoredUser({
            id: response.data.marketingAdmin.id,
            email: response.data.marketingAdmin.email,
            fullName: response.data.marketingAdmin.fullName,
            role: role,
          });
          setStoredRole(role);
          router.push('/marketing/dashboard');
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to login, please try again.");
        },
      }
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#F3FFED] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
        <LogoIcon size={48} />

        <Typography variant="intro" className="mt-8 mb-6 font-semibold text-gray-900 text-center">
          Marketing Login
        </Typography>

        <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
          <Input
            label="Enter your email address or username"
            id="marketing-email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Enter your password"
            id="marketing-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            containerClassName="mt-5 mb-3"
          />

          <Button
            variant="primary"
            className="w-full uppercase mt-4 bg-primary hover:bg-[#4a8929] border-none py-3.5"
            size="large"
            onClick={handleLogin}
            isLoading={isPending}
            disabled={!email || !password}
          >
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MarketingLogin;
