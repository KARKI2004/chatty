import { create } from "zustand";

const STORAGE_KEY = "chat-settings";

const getStoredSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const DEFAULT_SETTINGS = {
  notificationSounds: true,
  enterToSend: true,
  showMessagePreview: true,
};

export const useSettingsStore = create((set, get) => ({
  ...DEFAULT_SETTINGS,
  ...getStoredSettings(),
  setSetting: (key, value) => {
    const next = { ...get(), [key]: value };
    set(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  },
}));
