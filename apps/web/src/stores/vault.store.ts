import { create } from "zustand"

interface VaultStore {
    masterKey: string | null;
    expiresAt: number | null;
    isUnlocked: () => boolean;
    unlock: (k: string) => void;
    lock: () => void;
}

// Used to expire the master key storage key on session storage
// Makes the user re-authenticate the vault master password (just vault, no account)
const VAULT_MASTER_DURATION = 10 * 60 * 1000; // TODO: Make it dynamic with settings page

export const useVaultStore = create<VaultStore>(( set, get ) => ({
    masterKey: null,
    expiresAt: null,
    isUnlocked() {
        const { masterKey, expiresAt } = get();
        if(!masterKey || !expiresAt) return false;
        return Date.now() < expiresAt;
    },
    unlock(k) {
        set({
            masterKey: k,
            expiresAt: Date.now() + VAULT_MASTER_DURATION
        });

        setTimeout(() => {
            get().lock();
        }, VAULT_MASTER_DURATION)
    },
    lock() {
        set({ masterKey: null, expiresAt: null })
    },
}))