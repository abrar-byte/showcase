'use client';
import React from 'react';
import Modal, { DialogProps } from '../Modal';
import Button from '../Button';

type Props = {
  dialogProps: DialogProps;
  title?: string;
  text?: string;
  handleConfirm: any;
  disabled?: boolean;
};

export default function ConfirmModal({
  dialogProps,
  title,
  text,
  handleConfirm,
  disabled = false,
}: Props) {
  const [dialog, setDialog] = dialogProps;

  const handleClose = () => {
    setDialog(false);
  };

  return (
    <Modal dialogProps={[dialog, setDialog]} handleClose={handleClose}>
      <div className="w-[344px] lg:w-[400px] space-y-5 text-center">
        {title && <h5 className="font-bold text-lg">{title}</h5>}
        <p>{text}</p>

        <div className="flex justify-between gap-2 w-full">
          <Button variant="primary" className="w-full" onClick={handleClose}>
            No
          </Button>
          <Button
            outline
            disabled={disabled}
            className="w-full"
            onClick={handleConfirm}
          >
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
