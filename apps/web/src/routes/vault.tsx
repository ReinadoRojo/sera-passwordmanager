import { useEffect, useState } from "react";
import { isAuthenticated, sb } from "../lib/supabase"
import { Button } from "@/components/ui/button";
import { errorMessageHandle } from "@/lib/utils";

function VaultPage() {
    const [allowed, setAllowed] = useState<boolean | null>(null);

    const params = new URLSearchParams(location.search);

    useEffect(() => {
        let cancelled = false;

        isAuthenticated().then(([authenticated, user]) => {
            if(cancelled) return;
            setAllowed(!!authenticated && !!user)
        }).catch(() => {
            if(cancelled) return;
            setAllowed(false);
        });

        return () => {
            cancelled = true;
        }
    }, []);

    if(allowed === null) {
        return (
            <h1>Loading...</h1>
        )
    }

    if(allowed === false) {
        return (
            <h1>Access Denied</h1>
        )
    }

    async function signOut() {
        const { error } = await sb.auth.signOut();
        if(error) {
            console.error("Error signing out:", errorMessageHandle(error.code));
            return;
        }
        location.href = "/";
    }

    return (
        <div className="h-screen max-w-dvw flex flex-col w-dvw">
            <header className="p-4 border-b flex justify-between items-center">
                <div className="flex flex-row items-center space-x-6 text-[#d3d3d3]">
                    <img src="/logo.svg" alt="Sera password manager logo" className="size-10"/>
                    <h1 className="text-xl font-bold">Sera Vault</h1>
                </div>
                <div className="flex flex-row items-center justify-end">
                    {/* Navigation */}
                    <nav className="mr-6">
                        <Button variant={"link"} size={"sm"} asChild>
                            <a href="/vault">Vault</a>
                        </Button>
                        <Button variant={"link"} size={"sm"} asChild>
                            <a href="/settings">Settings</a>
                        </Button>
                    </nav>

                    {/* Logout button */}
                    <Button variant={"outline"} size={"sm"} onClick={() => {
                        signOut();
                    }}>
                        Logout
                    </Button>
                </div>
            </header>
            <main className="container mx-auto">
                <h2>Welcome to your vault!</h2>
            </main>
            <footer>
                <p>© {new Date().getFullYear()} Sera Password Manager</p>
            </footer>
            {/* Floating toolbar with filters */}
            {/* This div is just a container for the toolbar, hover on it will reveal the toolbar, is to avoid hover bugs */}
            <div className="fixed -bottom-6 hover:bottom-2 transition-all transition-discrete duration-200 left-1/2 transform -translate-x-1/2 w-fit bg-transparent backdrop-blur-xl border border-white/75 shadow-md inset-shadow-accent-foreground p-4 flex justify-center rounded-md">
                <Button variant={"ghost"} size={"sm"}>All</Button>
                <Button variant={"ghost"} size={"sm"}>Favorites</Button>
                <Button variant={"ghost"} size={"sm"}>Shared</Button>
                <Button variant={"ghost"} size={"sm"}>Archived</Button>
            </div>
        </div>
    )
}

export default VaultPage