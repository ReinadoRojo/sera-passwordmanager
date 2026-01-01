import { createSecurityProfile, isValidMasterPassword } from "@/lib/crypto";
import { useVaultStore } from "@/stores/vault.store"
import { LoaderCircleIcon, LockIcon, ShieldAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasSecurityProfile } from "@/lib/supabase";

export const VaultGate = ({ children }: { children: React.ReactNode }) => {
    const isUnlocked = useVaultStore(s => s.isUnlocked());
    const unlock = useVaultStore(s => s.unlock);

    const [masterPasswordInput, setMasterPasswordInput] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState<boolean>(false);
    const [vaultState, setVaultState] = useState<"loading" | "setup_needed" | "locked" | "unlocked">('loading');

    useEffect(() => {
        const checkVaultState = async () => {
            const hasProfile = await hasSecurityProfile();
            if(!hasProfile) {
                setVaultState("setup_needed");
            } else {
                setVaultState("locked");
            }
        }

        checkVaultState();
    }, [])

    const handleCreateMasterPassword = async () => {
        setPending(true);
        const avoidCreation = await hasSecurityProfile();

        if(avoidCreation) {
            setError("A security profile already exists. Please refresh the page and unlock the vault.");
            setPending(false);
            return;
        }

        const created = await createSecurityProfile(masterPasswordInput);
        if(!created) {
            setError("Failed to create security profile. Try again.");
            setPending(false);
            return;
        }

        unlock(masterPasswordInput);    // Unlock vault
        setMasterPasswordInput("");     // Reset input
        setError(null);                 // Reset error
        setPending(false);              // Reset pending
        setVaultState("unlocked");
    }

    const handleUnlock = async () => {
        setPending(true);
        const [isValid, errorMsg] = await isValidMasterPassword(masterPasswordInput)

        if(!isValid) {
            setError(errorMsg || "Invalid master password");
            setPending(false);
            return;
        }

        unlock(masterPasswordInput);    // Unlock vault
        setMasterPasswordInput("");     // Reset input
        setError(null);                 // Reset error
        setPending(false);              // Reset pending
        setVaultState("unlocked");
    }

    if(isUnlocked && vaultState === "unlocked") return <>{children}</>;

    return (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-6">
            {/* Icon */}
            {vaultState === "loading" && (<LoaderCircleIcon className="size-16 text-muted-foreground animate-spin" />)}
            {vaultState === "setup_needed" && (<ShieldAlertIcon className="size-16 text-muted-foreground" />)}
            {vaultState === "locked" && (<LockIcon className="size-16 text-muted-foreground" />)}

            {/* Title */}
            {vaultState === "loading" && <h2 className="text-xl font-semibold">Loading vault</h2>}
            {vaultState === "setup_needed" && <h2 className="text-xl font-semibold">Oh! We need to setup something</h2>}
            {vaultState === "locked" && <h2 className="text-xl font-semibold">The vault is locked</h2>}
            
            {/* Description */}
            {vaultState === "loading" && <p className="text-center text-muted-foreground max-w-sm">Hold on a moment while we load your data.</p>}
            {vaultState === "setup_needed" && <p className="text-center text-muted-foreground max-w-sm">First time here, huh? We need to setup a master password for your vault! Click on the button below!</p>}
            {vaultState === "locked" && <p className="text-sm text-muted-foreground">Click on the button below to unlock it and access your personal vault.</p>}

            {/* Body */}
            {vaultState === "setup_needed" && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={"lg"}>
                            Create a master password
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-md">
                        <DialogHeader>
                            <DialogTitle>Create a safe master password</DialogTitle>
                            <DialogDescription>
                                This password will be used to encrypt and decrypt your vault data. Make sure it's strong and memorable!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Master Password"
                                value={masterPasswordInput}
                                onChange={(e) => setMasterPasswordInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreateMasterPassword()}
                                readOnly={pending}
                            />
                            <p className="text-sm p-5 border border-muted-foreground rounded-md bg-muted/10">
                                <strong>NOTE:</strong> This password isn't stored anywhere else than your mind. If you forget it, bye bye data!<br />
                                Also, at this moment isn't a way to change it, so choose wisely... or wait for a commit that adds that feature.
                            </p>
                        </div>
                        <DialogFooter className="flex flex-row justify-between w-full mt-3 items-center">
                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                            <Button onClick={handleCreateMasterPassword} className="ml-auto" disabled={pending}>
                                Unlock
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            {vaultState === "locked" && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={"lg"}>
                            Unlock vault
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-sm">
                        <DialogHeader>
                            <DialogTitle>Unlock Vault</DialogTitle>
                        </DialogHeader>
                        <div>
                            <Input
                                type="password"
                                placeholder="Master Password"
                                value={masterPasswordInput}
                                onChange={(e) => setMasterPasswordInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                                readOnly={pending}
                            />
                        </div>
                        <DialogFooter className="flex flex-row justify-between w-full mt-3 items-center">
                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}
                            <Button onClick={handleUnlock} className="ml-auto" disabled={pending}>
                                Unlock
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}