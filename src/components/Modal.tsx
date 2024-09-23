import React, { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Close from '@/components/icons/Close';
import { obj } from '@/types';

export type DialogType = 'add' | 'edit' | 'delete';
export type DialogValue = boolean | { type: DialogType; item?: obj | null };
export type DialogProps = [
  DialogValue,
  ((v?: boolean) => void) | React.Dispatch<React.SetStateAction<DialogValue>>,
];

interface ModalProps {
  dialogProps: DialogProps;
  children: ReactNode;
  classNameContent?: string;
  classNameClose?: string;
  noPadding?: boolean;
  handleClose?: () => void;
  dark?: boolean;
}
function Modal({
  children,
  dialogProps,
  classNameContent,
  classNameClose,
  noPadding,
  handleClose,
  dark,
}: ModalProps) {
  const [dialog, setDialog] = dialogProps;
  const closeDialog = () => {
    if (handleClose) {
      console.log('handleClose  found');

      handleClose();
    } else {
      console.log('handleClose not found');

      setDialog(false);
    }
  };
  return (
    <Dialog.Root open={!!dialog} onOpenChange={setDialog}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0 z-[999]" />
        <Dialog.Content
          className={`z-[9999] data-[state=open]:animate-contentShow fixed  top-[50%] left-[50%] max-h-[85vh]  translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-white  shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none ${classNameContent} ${noPadding ? '' : 'p-3 lg:p-5'}  overflow-auto`}
        >
          {children}
          <button
            className={`${classNameClose} absolute top-[10px] right-[10px] appearance-none active:outline-none active:border-0 active:outline-0 active:ring-0 outline-none border-none ring-0`}
            aria-label="Close"
            onClick={closeDialog}
          >
            <Close
              className={`w-5 h-5 ${dark ? 'stroke-white' : 'stroke-black'} focus:outline-none `}
            />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
