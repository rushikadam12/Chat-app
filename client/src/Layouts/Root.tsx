import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/pages/Footer";
// import useSocketStore from "@/Zustand/useSocketStore";
// import { useEffect } from "react";
// import { Socket, io } from "socket.io-client";
import { SocketProvider } from "@/context/socketContext";

const RootLayout = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        
          <div className="flex h-screen flex-col ">
            <header className="w-fit ">
              <Navbar />
            </header>
            <main className="ml-12 px-1">
              <Outlet />
            </main>
            <footer className="border-2">
              <Footer />
            </footer>
          </div>
        
      </ThemeProvider>
    </>
  );
};
export default RootLayout;
