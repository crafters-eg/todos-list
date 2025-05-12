"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { FaGithub } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Card } from "./ui/card";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { createPortal } from "react-dom";
import { useTheme } from "./providers/ThemeProvider";
import { FiLogIn } from "react-icons/fi";
import Link from "next/link";

export function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const { theme, setTheme, isDarkMode } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Prevent body scrolling when popup is open
  useEffect(() => {
    if (showSettingsPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showSettingsPopup]);

  if (status === "loading") {
    return <div className="animate-pulse h-10 w-10 rounded-full bg-gray-200"></div>;
  }

  if (status === "unauthenticated") {
    return (
      <Link href="/auth/signin">
        <Button
          variant='outline'
          className='ml-2'
        >
          <FiLogIn />
          Login
        </Button>
      </Link>
    );
  }

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  // Modal component
  const SettingsModal = () => {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowSettingsPopup(false);
          }
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh'
        }}
      >
        <Card className="w-[400px] max-w-[90vw] p-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">Settings</h2>
            <button
              onClick={() => setShowSettingsPopup(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 dark:text-white">Profile</h3>
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={session?.user?.image || "https://github.com/ghost.png"}
                  alt={session?.user?.name || "User"}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-medium dark:text-white">{session?.user?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">{session?.user?.email}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2 dark:text-white">Appearance</h3>
              <div className="flex items-center justify-between p-3 rounded-md border dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  {isDarkMode ?
                    <MdDarkMode className="text-xl text-indigo-500" /> :
                    <MdLightMode className="text-xl text-amber-500" />
                  }
                  <span className="text-sm font-medium dark:text-white">
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
                <div
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer"
                >
                  <span className={`${isDarkMode ? "bg-indigo-600" : "bg-gray-300"
                    } absolute h-6 w-11 rounded-full transition-colors`} />
                  <span className={`${isDarkMode ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </div>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                onClick={() => setShowSettingsPopup(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-medium dark:text-white">{session?.user?.name}</span>
          <span className="text-xs text-gray-500 dark:text-neutral-400">{session?.user?.email}</span>
        </div>
        <Popover>
          <PopoverTrigger>
            <img
              src={session?.user?.image || "https://github.com/ghost.png"}
              alt={session?.user?.name || "User"}
              className="h-10 w-10 min-h-8 min-w-10 rounded-full ring-2 ring-gray-200 hover:ring-gray-300 dark:ring-neutral-700 dark:hover:ring-neutral-600 transition-all cursor-pointer"
            />
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0 dark:bg-neutral-900 dark:border-neutral-800">
            <div className="py-2">
              <button
                onClick={() => {
                  setShowSettingsPopup(true);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 hover:cursor-pointer"
              >
                <IoSettingsOutline className="mr-2" />
                Settings
              </button>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 hover:cursor-pointer"
              >
                <LuLogOut className="mr-2" />
                Sign out
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Portal the modal to the document body */}
      {isMounted && showSettingsPopup && createPortal(<SettingsModal />, document.body)}
    </div>
  );
} 