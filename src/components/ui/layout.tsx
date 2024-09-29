
import { ThemeProvider } from "./providers/theme-provider";
export default function RootLayout({
  children,
}: Readonly<{
  
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
