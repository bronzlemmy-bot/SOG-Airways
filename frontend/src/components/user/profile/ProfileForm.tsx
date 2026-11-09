"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import ProfileAvatar from "./ProfileAvatar";
import ProfileHeader from "./ProfileHeader";
import PersonalInformation from "./PersonalInformation";
import ContactInformation from "./ContactInformation";

import ProfileActions from "./ProfileActions";

import {
profileData,
type ProfileData,
} from "./profile-data/ProfileData";
import TravelPreferences from "./TravelPreferences";

function cloneProfile(profile: ProfileData): ProfileData {
return {
...profile,
personal: {
...profile.personal,
},
contact: {
...profile.contact,
},
travel: {
...profile.travel,
},
account: {
...profile.account,
},
avatar: {
...profile.avatar,
},
};
}

export default function ProfileForm() {
const [profile, setProfile] = useState<ProfileData>(() =>
cloneProfile(profileData),
);

const [savedProfile, setSavedProfile] = useState<ProfileData>(() =>
cloneProfile(profileData),
);

const [isEditing, setIsEditing] = useState(false);
const [showSavedMessage, setShowSavedMessage] = useState(false);

const fileInputRef = useRef<HTMLInputElement | null>(null);
const previousAvatarUrlRef = useRef<string | null>(null);

useEffect(() => {
return () => {
if (previousAvatarUrlRef.current) {
URL.revokeObjectURL(previousAvatarUrlRef.current);
}
};
}, []);

const handlePersonalChange = (
field: keyof ProfileData["personal"],
value: string,
) => {
setProfile((current) => ({
...current,
personal: {
...current.personal,
[field]: value,
},
}));
};

const handleContactChange = (
field: keyof ProfileData["contact"],
value: string,
) => {
setProfile((current) => ({
...current,
contact: {
...current.contact,
[field]: value,
},
}));
};

const handleTravelChange = (
field: keyof ProfileData["travel"],
value: string,
) => {
setProfile((current) => ({
...current,
travel: {
...current.travel,
[field]: value,
},
}));
};

const handleEdit = () => {
setShowSavedMessage(false);
setIsEditing(true);
};

const handleSave = () => {
const updatedProfile = cloneProfile(profile);


setSavedProfile(updatedProfile);
setProfile(updatedProfile);
setIsEditing(false);
setShowSavedMessage(true);

window.setTimeout(() => {
  setShowSavedMessage(false);
}, 3000);


};

const handleCancel = () => {
setProfile(cloneProfile(savedProfile));
setIsEditing(false);
setShowSavedMessage(false);
};

const handleAvatarChange = () => {
fileInputRef.current?.click();
};

const handleAvatarFileChange = (
event: React.ChangeEvent<HTMLInputElement>,
) => {
const file = event.target.files?.[0];


if (!file) {
  return;
}

if (!file.type.startsWith("image/")) {
  event.target.value = "";
  return;
}

const imageUrl = URL.createObjectURL(file);

if (previousAvatarUrlRef.current) {
  URL.revokeObjectURL(previousAvatarUrlRef.current);
}

previousAvatarUrlRef.current = imageUrl;

setProfile((current) => ({
  ...current,
  avatar: {
    ...current.avatar,
    image: imageUrl,
  },
}));

event.target.value = "";


};

return ( <div className="space-y-6"> <ProfileHeader isEditing={isEditing} />


  <div className="flex justify-end">
    <ProfileActions
      isEditing={isEditing}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  </div>

  {showSavedMessage && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0" />
      <span>Your profile changes have been saved for this session.</span>
    </motion.div>
  )}

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleAvatarFileChange}
    className="hidden"
    aria-label="Upload profile photo"
  />

  <ProfileAvatar
    profile={profile}
    isEditing={isEditing}
    onAvatarChange={handleAvatarChange}
  />

  <div className="grid gap-6">
    <PersonalInformation
      profile={profile}
      isEditing={isEditing}
      onChange={handlePersonalChange}
    />

    <ContactInformation
      profile={profile}
      isEditing={isEditing}
      onChange={handleContactChange}
    />

    <TravelPreferences
      profile={profile}
      isEditing={isEditing}
      onChange={handleTravelChange}
    />
  </div>

  <div className="flex justify-end border-t border-slate-200 pt-6 dark:border-slate-800">
    <ProfileActions
      isEditing={isEditing}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  </div>
</div>


);
}
