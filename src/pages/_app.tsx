import type { AppProps } from 'next/app';
import RootLayout from '../components/ui/layout';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/ui/providers/theme-provider';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <Component {...pageProps} />
      </ThemeProvider>
    </RootLayout>
  );
}

export default MyApp;