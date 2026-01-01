import { useEffect } from "react"
import { isAuthenticated } from "../lib/supabase"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login.form"
import { AuthHeader } from "@/components/auth/common"

const VAULT_URL = `/vault`
const SIGN_UP_URL = "/signup"

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
        <main className="h-screen w-screen flex items-center justify-center">
            <Card className="w-100 mx-auto">
                <CardHeader>
                    <AuthHeader />
                </CardHeader>
                <CardContent>
                    <LoginForm redirectTo={VAULT_URL} />
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col space-y-4">
                        <p className="text-center text-sm text-[#d3d3d3]">
                            Don't have an account? <a href={SIGN_UP_URL} className="text-blue-500 underline">Sign up</a>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </main>
    )
}

export default AuthPage