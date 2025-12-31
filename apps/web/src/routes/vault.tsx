import { useEffect, useState } from "react";
import { isAuthenticated } from "../lib/supabase"

function VaultPage() {
    const [allowed, setAllowed] = useState<boolean | null>(null);

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

    return (
        <h1>Vault page</h1>
    )
}

export default VaultPage