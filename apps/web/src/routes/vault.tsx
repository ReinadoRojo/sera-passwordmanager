import { useState } from "react";
import { isAuthenticated } from "../lib/supabase"

function VaultPage() {
    const [allowed, setAllowed] = useState<boolean | null>(null);

    isAuthenticated().then(([authenticated,]) => {
        setAllowed(!!authenticated);
    }).catch(() => false)

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