"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import SettingsHeader from "./SettingsHeader";
import AccountSettings from "./AccountSettings";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";
import SecuritySettings from "./SecuritySettings";
import AppearanceSettings from "./AppearanceSettings";
import SettingsActions from "./SettingsActions";

import {
settingsData,
type SettingsData as SettingsDataType,
} from "./settings-data/SettingsData";

type AccountField = keyof SettingsDataType["account"];
type NotificationField = keyof SettingsDataType["notifications"];
type PrivacyField = keyof SettingsDataType["privacy"];
type SecurityField = keyof SettingsDataType["security"];
type AppearanceField = keyof SettingsDataType["appearance"];

function cloneSettings(): SettingsDataType {
return {
account: {
...settingsData.account,
},
notifications: {
...settingsData.notifications,
},
privacy: {
...settingsData.privacy,
},
security: {
...settingsData.security,
},
appearance: {
...settingsData.appearance,
},
};
}

function copySettings(settings: SettingsDataType): SettingsDataType {
return {
account: {
...settings.account,
},
notifications: {
...settings.notifications,
},
privacy: {
...settings.privacy,
},
security: {
...settings.security,
},
appearance: {
...settings.appearance,
},
};
}

export default function SettingsForm() {
const { setTheme } = useTheme();

const [settings, setSettings] = useState<SettingsDataType>(() =>
cloneSettings(),
);

const [savedSettings, setSavedSettings] =
useState<SettingsDataType>(() => cloneSettings());

const [isEditing, setIsEditing] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [saveSuccess, setSaveSuccess] = useState(false);

const handleEdit = () => {
setSaveSuccess(false);
setIsEditing(true);
};

const handleCancel = () => {
const restoredSettings = copySettings(savedSettings);


setSettings(restoredSettings);
setIsEditing(false);
setSaveSuccess(false);

setTheme(restoredSettings.appearance.theme);


};

const handleSave = async () => {
if (isSaving) return;


setIsSaving(true);
setSaveSuccess(false);

try {
  // Temporary frontend save.
  // This will later become the authenticated API request
  // that saves the settings to MongoDB.

  await new Promise((resolve) => setTimeout(resolve, 500));

  const newSavedSettings = copySettings(settings);

  setSavedSettings(newSavedSettings);
  setTheme(newSavedSettings.appearance.theme);

  setSaveSuccess(true);

  window.setTimeout(() => {
    setIsEditing(false);
  }, 900);
} finally {
  setIsSaving(false);
}


};

const handleAccountChange = (
field: AccountField,
value: string,
) => {
setSettings((current) => ({
...current,
account: {
...current.account,
[field]: value,
},
}));
};

const handleNotificationChange = (
field: NotificationField,
value: boolean,
) => {
setSettings((current) => ({
...current,
notifications: {
...current.notifications,
[field]: value,
},
}));
};

const handlePrivacyChange = (
field: PrivacyField,
value: boolean,
) => {
setSettings((current) => ({
...current,
privacy: {
...current.privacy,
[field]: value,
},
}));
};

const handleSecurityChange = (
field: SecurityField,
value: boolean,
) => {
setSettings((current) => ({
...current,
security: {
...current.security,
[field]: value,
},
}));
};

const handleAppearanceChange = (
field: AppearanceField,
value: string | boolean,
) => {
setSettings((current) => ({
...current,
appearance: {
...current.appearance,
[field]: value as never,
},
}));


if (field === "theme" && typeof value === "string") {
  setTheme(value);
}


};

return ( <div className="space-y-6"> <SettingsHeader isEditing={isEditing} />


  <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        Account Preferences
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        {isEditing
          ? "Make your changes and save them when you are finished."
          : "Your current SOG Airways preferences are shown below."}
      </p>
    </div>

    <SettingsActions
      isEditing={isEditing}
      isSaving={isSaving}
      saveSuccess={saveSuccess}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  </div>

  {saveSuccess && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300"
    >
      <CheckCircle2 className="h-5 w-5 shrink-0" />

      <span>Your settings have been saved successfully.</span>
    </motion.div>
  )}

  <div className="grid gap-6">
    <AccountSettings
      settings={settings}
      isEditing={isEditing}
      onChange={handleAccountChange}
    />

    <NotificationSettings
      settings={settings}
      isEditing={isEditing}
      onChange={handleNotificationChange}
    />

    <PrivacySettings
      settings={settings}
      isEditing={isEditing}
      onChange={handlePrivacyChange}
    />

    <SecuritySettings
      settings={settings}
      isEditing={isEditing}
      onChange={handleSecurityChange}
    />

    <AppearanceSettings
      settings={settings}
      isEditing={isEditing}
      onChange={handleAppearanceChange}
    />
  </div>

  {isEditing && (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end border-t border-slate-200 pt-6 dark:border-slate-800"
    >
      <SettingsActions
        isEditing={isEditing}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </motion.div>
  )}
</div>


);
}
