import { create } from 'zustand';

const useDialog = create((set: any, get: any) => {
  return {
    dialog: false,
    setDialog: (value?: boolean) => {
      set({ dialog: value || !get().dialog });
    },
    closeDialog: () => {
      set({ dialog: false });
    },
  };
});

export default useDialog;
