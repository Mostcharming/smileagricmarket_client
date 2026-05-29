'use client'

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InfoIcon, PhotoIcon } from "@/components/icons";
import { MainHeader, Input, ProfileCompletion } from "@/components/ui";
import { getStoredUser } from "@/utils";
import type { profileSchema } from "@/types";

const getInitials = (fullName?: string) => {
  const cleanedName = fullName?.trim();

  if (!cleanedName) {
    return "JM";
  }

  const parts = cleanedName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const ProfilePage = () => {
  const [storedUser, setStoredUser] = useState<profileSchema | null>(() => getStoredUser());
  const [fullName, setFullName] = useState(() => storedUser?.fullName ?? "James Omoja");
  const [gender, setGender] = useState(() => storedUser?.gender ?? "Male");
  const [email, setEmail] = useState(() => storedUser?.email ?? "jamesonoja@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState(() => storedUser?.phoneNumber ?? "090292019201");
  const [about, setAbout] = useState("");

  useEffect(() => {
    const handleStorageChange = () => {
      const user = getStoredUser();
      setStoredUser(user);

      if (user?.fullName) {
        setFullName(user.fullName);
      }

      if (user?.gender) {
        setGender(user.gender);
      }

      if (user?.email) {
        setEmail(user.email);
      }

      if (user?.phoneNumber) {
        setPhoneNumber(user.phoneNumber);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const initials = useMemo(() => getInitials(storedUser?.fullName || fullName), [fullName, storedUser?.fullName]);
  const completion = 64;

  return (
    <div className="min-h-screen bg-[#EFF8E8]">
      <MainHeader />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-[13px] text-[#A0A79A]">
          <Link href="/dashboard" className="hover:text-[#6B7280]">
            Home
          </Link>
          <span className="px-1">/</span>
          <span className="font-medium text-[#78806F]">Profile</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_264px] lg:items-start">
          <section className="rounded-[18px] border border-[#DFE7D3] bg-white px-6 py-7 shadow-[0_3px_8px_rgba(21,28,11,0.03)] sm:px-8 sm:py-8">
            <h1 className="text-[21px] font-semibold text-[#374151]">Profile Details</h1>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row items-center">
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  className="flex h-[68px] w-[68px] items-center justify-center rounded-xl bg-[#DDE6D4] text-[#5A6154]"
                  aria-label="Upload profile photo"
                >
                  <PhotoIcon />
                </button>

                <div className="text-[13px] text-[#394136]">Add your Photo</div>
              </div>

              <div className="flex-1 rounded-[18px] bg-[#F8ECD2] px-4 py-4 text-[15px] leading-6 text-[#2E3640] shadow-[0_1px_0_rgba(17,24,39,0.02)]">
                <div className="flex items-start gap-3">
                  <InfoIcon className="mt-0.5 shrink-0" />
                  <p>
                    Profiles with a photo get <b>3.4X more</b> investor responses. Upload one to boost your trust score.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Input id="fullname" label="Fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input id="gender" label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
              <Input id="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input id="phone" label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>

            <div className="mt-4">
              <Input id="about" as="textarea" label="A little about yourself" value={about} onChange={(e) => setAbout(e.target.value)} rows={3} />
            </div>

            <button
              type="button"
              className="mt-8 inline-flex min-w-44 items-center justify-center rounded-md bg-[#5DA334] px-6 py-2 text-[15px] font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.04)] transition hover:bg-[#4E912A]"
            >
              Save
            </button>
          </section>

          <ProfileCompletion
            completion={completion}
            items={[
              { label: "Basic details", status: "Complete", tone: "bg-[#EAF6DF] text-[#7AB44A]", complete: true },
              { label: "KYC Verification", status: "Pending", tone: "bg-[#F3F4F6] text-[#78716C]" },
              { label: "Wallet/Account", status: "Setup", tone: "bg-[#EAF6DF] text-[#7AB44A]", href: "/settings" },
            ]}
          />
        </div>
      </main>

      <div className="pointer-events-none fixed right-4 top-16 hidden h-0 w-0 sm:block" aria-hidden="true">
        <span className="sr-only">{initials}</span>
      </div>
    </div>
  );
};

export default ProfilePage;