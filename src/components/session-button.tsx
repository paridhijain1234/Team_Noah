"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
    const { data: session } = useSession();

    return session ? (
        <>
            <p>Hi, {session.user?.name}</p>
            <Button onClick={() => signOut()}>Sign out</Button>
        </>
    ) : (
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    );
}
