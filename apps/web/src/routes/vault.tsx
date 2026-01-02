import { useEffect, useMemo, useState } from "react";
import { isAuthenticated, sb } from "../lib/supabase"
import { Button } from "@/components/ui/button";
import { cn, errorMessageHandle } from "@/lib/utils";
import { VaultGate } from "@/components/vault/vault-gate.comp";
import { useVaultStore } from "@/stores/vault.store";
import { VaultList } from "@/components/vault/vault.list";
import { PlusIcon } from "lucide-react";
import { VaultNewDialog } from "@/components/vault/vault.new";

function VaultPage() {
    const [allowed, setAllowed] = useState<boolean | null>(null);
    const vaultUnlocked = useVaultStore(s => s.isUnlocked());

    const filter = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get("filter") || "all";
    }, []);

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

    // function filterChange(newFilter: string) {
    //     const params = new URLSearchParams(location.search);
    //     params.set("filter", newFilter);
    //     location.search = params.toString();
    // }

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
            <main className="container mx-auto space-y-4 pt-8">
                <VaultGate>
                    <div className="flex flex-row">
                        <VaultNewDialog>
                            <Button variant={"outline"} size={"sm"} className="ml-auto">
                                <PlusIcon className="size-4"/> Add a new entry
                            </Button>
                        </VaultNewDialog>
                    </div>
                    <VaultList />
                </VaultGate>
            </main>
            {/* <footer>
                <p>© {new Date().getFullYear()} Sera Password Manager</p>
            </footer> */}
            {/* Floating toolbar */}
            {/* This div is just a container for the toolbar, hover on it will reveal the toolbar, is to avoid hover bugs */}
            <div className={cn(
                "fixed -bottom-6 hover:bottom-2 transition-all transition-discrete duration-200 left-1/2 transform -translate-x-1/2 w-fit bg-transparent backdrop-blur-xl border border-white/75 shadow-md inset-shadow-accent-foreground p-4 flex justify-center rounded-md",
                !vaultUnlocked && "opacity-50 pointer-events-none"
            )}>
                <Button variant={"ghost"} size={"sm"} disabled={!vaultUnlocked}>Filters</Button>
                <VaultNewDialog>
                    <Button variant={"ghost"} size={"sm"} disabled={!vaultUnlocked}>New login</Button>
                </VaultNewDialog>
                <Button variant={"ghost"} size={"sm"} disabled={!vaultUnlocked}>Generate password</Button>
            </div>
        </div>
    )
}

export default VaultPage