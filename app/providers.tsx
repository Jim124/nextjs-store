'use client';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/sonner';
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </>
  );
};
export default Providers;
