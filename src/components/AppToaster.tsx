import { Toaster } from 'react-hot-toast';

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        success: { duration: 2000 },
        error: { duration: 3000 },
      }}
    />
  );
}
