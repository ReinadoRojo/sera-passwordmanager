import { useEffect } from "react"
import { isAuthenticated } from "../lib/supabase"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { RegisterForm } from "@/components/register.form"

const VAULT_URL = `/vault`
const SIGN_IN_URL = "/"

function SignupPage() {
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
                    <div className="flex flex-row space-x-4 items-center justify-center">
                        <img src="/logo-white.svg" alt="Sera password manager" className="size-14"/>
                        <h1 className="text-2xl font-bold text-[#283841]">Sera</h1>
                    </div>
                    <p className="mx-auto text-sm text-[#283841]">Open-source password manager</p>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
                <CardFooter>
                    <div className="flex flex-col space-y-4">
                        <p className="text-center text-sm text-[#283841]">
                            You have already an account? <a href={SIGN_IN_URL} className="text-blue-500 underline">Sign in</a>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </main>
    )
}

export default SignupPage