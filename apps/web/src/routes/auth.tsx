import { useEffect } from "react"
import { isAuthenticated } from "../lib/supabase"
import { Card } from "@vault/ui/components/ui/card.tsx"

const VAULT_URL = `/vault`

function AuthPage() {
    useEffect(() => {
        if(!window) return
        // Check if authenticated
        isAuthenticated().then(([authenticated, user]) => {
            if(authenticated && user) {
                location.href = VAULT_URL
            }
        })
    }, [])

    return (
        <Card>

        </Card>
    )
}

export default AuthPage