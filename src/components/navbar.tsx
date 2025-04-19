"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CatIcon } from "lucide-react";
import { ModeToggle } from "./ui/mode-toggle";

export default function Navbar() {
  const { data: session } = useSession();

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
    } catch (error) {
      toast.error("Failed to sign out", {
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background/80 backdrop-blur-md rounded-full border shadow-lg px-6 py-3">
        <NavigationMenu>
          <NavigationMenuList className="space-x-1">
            <NavigationMenuItem>
              <Link
                href="/"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full px-4"
                )}
              >
                <CatIcon />
              </Link>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <Link
                href="/"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full px-4"
                )}
              >
                <CatIcon />
              </Link>
            </NavigationMenuItem> */}
            <NavigationMenuItem>
              <Link
                href="/agents"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "rounded-full px-4"
                )}
              >
                Demo
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="ml-1">
              {session ? (
                <NavigationMenuTrigger className="rounded-full">
                  <div className="flex items-center gap-2.5 px-1">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={session.user?.image ?? ""}
                        alt={session.user?.name ?? ""}
                      />
                      <AvatarFallback className="text-xs">
                        {session.user?.name?.charAt(0) ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {session.user?.name?.split(" ")[0]}
                    </span>
                  </div>
                </NavigationMenuTrigger>
              ) : (
                <button
                  onClick={handleSignIn}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full px-5"
                  )}
                >
                  Sign in
                </button>
              )}

              {session && (
                <NavigationMenuContent>
                  <div className="p-3 w-[220px]">
                    <div className="flex flex-col gap-2.5 p-2">
                      <div className="text-sm font-medium">
                        {session.user?.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="text-sm text-red-500 hover:text-red-600 mt-3 text-left flex items-center gap-2"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </NavigationMenuContent>
              )}
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
