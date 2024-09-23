import { create } from 'zustand';

const useToggle = create((set: any, get: any) => {
  return {
    hasSidebar: false,
    toggleSidebar: (value?: boolean) => {
      set({ hasSidebar: value || !get().hasSidebar });
    },
    closeSidebar: () => {
      set({ hasSidebar: false });
    },
  };
});

export default useToggle;
