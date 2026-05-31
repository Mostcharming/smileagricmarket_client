/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { InfoIcon, PhotoIcon } from "@/components/icons";
import { MainHeader, Input, ProfileCompletion } from "@/components/ui";
import { getStoredUser, setStoredUser as setStoredUserInStorage } from "@/utils";
import type { profileSchema } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetWebProfile,
  useGetWebProfileCompletionStatus,
  useUpdateWebProfile,
  useUploadWebProfilePicture,
} from "@/mutation";
import { toast } from "sonner";

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

const completeTone = "bg-[#EAF6DF] text-[#7AB44A]";
const pendingTone = "bg-[#F3F4F6] text-[#78716C]";

const mapProfileToStoredUser = (profile?: {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  profileImageUrl?: string;
  profileImage?: string;
  bio?: string;
  isPhoneVerified?: boolean;
  kycStatus?: string;
  kycInfo?: Record<string, unknown>;
  wallet?: unknown;
}): profileSchema | null => {
  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
    gender: profile.gender,
    profileImage: profile.profileImageUrl ?? profile.profileImage,
    profileImageUrl: profile.profileImageUrl,
    bio: profile.bio,
    isPhoneVerified: profile.isPhoneVerified,
    kycStatus: profile.kycStatus,
    kycInfo: profile.kycInfo,
    wallet: profile.wallet,
  };
};

const ProfilePage = () => {
  const [storedUser, setStoredUser] = useState<profileSchema | null>(null);
  const queryClient = useQueryClient();
  const { data: profileResponse, isLoading: isProfileLoading } = useGetWebProfile();
  const { data: completionResponse } = useGetWebProfileCompletionStatus();
  const { mutate: updateProfile, isPending: isSavingProfile } = useUpdateWebProfile();
  const { mutate: uploadPicture, isPending: isUploadingPicture } = useUploadWebProfilePicture();

  const profileSeed = useMemo(
    () => mapProfileToStoredUser(profileResponse?.data) ?? storedUser,
    [profileResponse?.data, storedUser]
  );

  useEffect(() => {
    setStoredUser(getStoredUser());

    const handleStorageChange = () => {
      setStoredUser(getStoredUser());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (profileSeed) {
      setStoredUserInStorage(profileSeed);
    }
  }, [profileSeed]);

  const initials = useMemo(() => getInitials(profileSeed?.fullName), [profileSeed?.fullName]);
  const completionData = completionResponse?.data;
  const completion = completionData?.completionPercentage ?? 64;
  const basicDetailsComplete = Boolean(
    completionData?.profileStatus?.fullName &&
      completionData?.profileStatus?.gender &&
      completionData?.profileStatus?.email &&
      completionData?.profileStatus?.phoneNumber &&
      completionData?.profileStatus?.bio
  );
  const profileCompletionItems = [
    {
      label: "Basic details",
      status: basicDetailsComplete ? "Complete" : "Pending",
      tone: basicDetailsComplete ? completeTone : pendingTone,
      complete: basicDetailsComplete,
    },
    {
      label: "KYC Verification",
      status: completionData?.profileStatus?.kycVerification ? "Complete" : "Pending",
      tone: completionData?.profileStatus?.kycVerification ? completeTone : pendingTone,
      complete: Boolean(completionData?.profileStatus?.kycVerification),
    },
    {
      label: "Wallet/Account",
      status: completionData?.profileStatus?.walletSetup ? "Setup" : "Pending",
      tone: completionData?.profileStatus?.walletSetup ? completeTone : pendingTone,
      href: "/settings",
      complete: Boolean(completionData?.profileStatus?.walletSetup),
    },
  ];
  const profileFormKey = profileResponse?.data
    ? [
        profileResponse.data.id,
        profileResponse.data.fullName,
        profileResponse.data.email,
        profileResponse.data.phoneNumber ?? "",
        profileResponse.data.gender ?? "",
        profileResponse.data.bio ?? "",
        profileResponse.data.profileImageUrl ?? "",
      ].join("|")
    : `stored-${storedUser?.id ?? "profile-form"}`;

  const ProfileEditor = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fullName, setFullName] = useState(profileSeed?.fullName ?? "James Omoja");
    const [gender, setGender] = useState(profileSeed?.gender ?? "Male");
    const [email, setEmail] = useState(profileSeed?.email ?? "jamesonoja@gmail.com");
    const [phoneNumber, setPhoneNumber] = useState(profileSeed?.phoneNumber ?? "090292019201");
    const [about, setAbout] = useState(profileSeed?.bio ?? "");
    const [profileImage, setProfileImage] = useState(profileSeed?.profileImageUrl || profileSeed?.profileImage || "");

    const handlePhotoSelect = () => {
      fileInputRef.current?.click();
    };

    const persistProfile = (nextProfile: profileSchema) => {
      setStoredUser(nextProfile);
      setStoredUserInStorage(nextProfile);
      setFullName(nextProfile.fullName ?? "");
      setGender(nextProfile.gender ?? "");
      setEmail(nextProfile.email ?? "");
      setPhoneNumber(nextProfile.phoneNumber ?? "");
      setAbout(nextProfile.bio ?? "");
      setProfileImage(nextProfile.profileImageUrl || nextProfile.profileImage || "");
    };

    const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append("picture", file);

      uploadPicture(formData, {
        onSuccess: async (response) => {
          const nextProfile: profileSchema = {
            ...(profileSeed ?? { id: response.data.id, fullName, email }),
            profileImage: response.data.profileImageUrl,
            profileImageUrl: response.data.profileImageUrl,
          };

          persistProfile(nextProfile);
          await queryClient.invalidateQueries({ queryKey: ["webProfile"] });
          await queryClient.invalidateQueries({ queryKey: ["webProfileCompletionStatus"] });
          toast.success(response.message || "Profile picture uploaded successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to upload profile picture");
        },
      });

      event.target.value = "";
    };

    const handleSaveProfile = () => {
      updateProfile(
        {
          fullName,
          gender,
          email,
          phoneNumber,
          bio: about,
        },
        {
          onSuccess: async (response) => {
            const profile = response.data;
            const nextProfile: profileSchema = {
              id: profile.id,
              fullName: profile.fullName,
              email: profile.email,
              phoneNumber: profile.phoneNumber,
              gender: profile.gender,
              profileImage: profile.profileImageUrl ?? profileSeed?.profileImage,
              profileImageUrl: profile.profileImageUrl ?? profileSeed?.profileImageUrl,
              bio: profile.bio,
              isPhoneVerified: profile.isPhoneVerified,
              kycStatus: profile.kycStatus,
              kycInfo: profile.kycInfo,
              wallet: profile.wallet,
            };

            persistProfile(nextProfile);
            await queryClient.invalidateQueries({ queryKey: ["webProfile"] });
            await queryClient.invalidateQueries({ queryKey: ["webProfileCompletionStatus"] });
            toast.success(response.message || "Profile updated successfully");
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update profile");
          },
        }
      );
    };

    return (
      <section className="rounded-[18px] border border-[#DFE7D3] bg-white px-6 py-7 shadow-[0_3px_8px_rgba(21,28,11,0.03)] sm:px-8 sm:py-8">
        <h1 className="text-[21px] font-semibold text-[#374151]">Profile Details</h1>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

        <div className="mt-8 flex flex-col gap-4 items-center sm:flex-row">
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handlePhotoSelect}
              disabled={isUploadingPicture}
              className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden cursor-pointer rounded-xl bg-[#DDE6D4] text-[#5A6154] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              aria-label="Upload profile photo"
            >
              {profileImage ? (
                <img src={profileImage} alt={profileSeed?.fullName || fullName} className="h-full w-full object-cover" />
              ) : (
                <PhotoIcon />
              )}
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
          <Input id="fullname" label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input id="gender" label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} />
          <Input id="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input id="phone" label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>

        <div className="mt-4">
          <Input id="about" as="textarea" label="A little about yourself" value={about} onChange={(e) => setAbout(e.target.value)} rows={3} />
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={isSavingProfile || isProfileLoading}
          className="mt-8 inline-flex min-w-44 items-center justify-center cursor-pointer rounded-md bg-[#5DA334] px-6 py-2 text-[15px] font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.04)] transition hover:bg-[#4E912A] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSavingProfile ? "Saving..." : "Save"}
        </button>
      </section>
    );
  };

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
          <ProfileEditor key={profileFormKey} />

          <ProfileCompletion completion={completion} items={profileCompletionItems} />
        </div>
      </main>

      <div className="pointer-events-none fixed right-4 top-16 hidden h-0 w-0 sm:block" aria-hidden="true">
        <span className="sr-only">{initials}</span>
      </div>
    </div>
  );
};

export default ProfilePage;