import useDialog from '@/stores/dialog';
import { useSession } from 'next-auth/react';

const useUnauthenticatedDialog = () => {
  const { status } = useSession();
  const { setDialog } = useDialog();

  const handleUnauthenticatedClick = () => {
    if (status === 'unauthenticated') {
      setDialog(true);
      return true;
    }
    return false;
  };

  return handleUnauthenticatedClick;
};

export default useUnauthenticatedDialog;
