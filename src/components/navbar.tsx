"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CatIcon, Menu, X } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";
import { Button } from "./ui/button";
import { useState } from "react";

const menuItems = [
  { name: "Demo", href: "/agents" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [menuState, setMenuState] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn("google");
      // Toast will show after successful redirect back
    } catch (error) {
      toast.error("Failed to sign in", {
        description:
          "There was a problem signing in with Google. Please try again.",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      toast.success("Signed out successfully", {
        description: "You have been signed out of your account.",
      });
      // Small delay to allow the toast to show before redirect
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, 300);
    } catch (_err) {
      toast.error("Failed to sign out", {
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  return (
    <header>
      <nav
        data-state={menuState ? 'active' : undefined}
        className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
      >
        <div className="m-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2">
                <CatIcon />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className={cn(
                  "m-auto size-6 duration-200",
                  menuState && "rotate-180 scale-0 opacity-0"
                )} />
                <X className={cn(
                  "absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200",
                  menuState && "rotate-0 scale-100 opacity-100"
                )} />
              </button>
            </div>

            <div className={cn(
              "bg-background mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent",
              menuState ? "block" : "hidden",
              "lg:flex"
            )}>
              <div className="lg:pr-4">
                <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150">
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                {session ? (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {}}
                      className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={session.user?.image ?? ""}
                          alt={session.user?.name ?? ""}
                        />
                        <AvatarFallback className="text-xs">
                          {session.user?.name?.charAt(0) ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{session.user?.name?.split(" ")[0]}</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleSignOut}>
                      <span>Sign out</span>
                    </Button>
                    <ModeToggle />
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignIn}>
                      <span>Sign in</span>
                    </Button>
                    <ModeToggle />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
