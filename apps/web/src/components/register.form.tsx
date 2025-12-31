import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sb } from "@/lib/supabase"

import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

export const RegisterForm = () => {
    const schema = z.object({
        email: z.email({ error: "Invalid email address" }),
        password: z.string().min(8, { error: "The password it too short" }).max(128, { error: "The password may be too long" })
        .refine((password) => /[A-Z]/.test(password), { error: "Please use at least one uppercase character" })
        .refine((password) => /[a-z]/.test(password), { error: "Please use at least one lowercase character" })
        .refine((password) => /[0-9]/.test(password), { error: "Please use at least one number" })
        .refine((password) => /[!@#$%^&*]/.test(password), { error: "Please use at least one special character" }),
        confirmPassword: z.string()
    }).refine(values => values.password === values.confirmPassword, { error: "Both passwords must be the same", path: ["confirmPassword"] })
    
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    async function onSubmit(formData: z.infer<typeof schema>) {
        const { email, password, confirmPassword } = formData;

        if(password !== confirmPassword) {
            error("Both passwords myst")
        }

        const { data, error } = await sb.auth.signUp({
            email,
            password,
        })

        if(error) {
            form.setError("email", {
                message: "",
                type: "validate",
            })
            form.setError("password", {
                message: "",
                type: "validate",
            })
            form.setError("root", {
                message: error.message,
                type: "validate",
            })
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState}) => (
                    <Field orientation={"responsive"} data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email" aria-invalid={fieldState.invalid}>Email</FieldLabel>
                        <Input type="email" placeholder="you@example.com" {...field} aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState}) => (
                    <Field orientation={"responsive"} data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password" aria-invalid={fieldState.invalid}>Password</FieldLabel>
                        <Input type="password" {...field} aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                {form.formState.errors.root && !form.formState.isValid ? "There is an error" : form.formState.isSubmitting ? "Logging in..." : "Log in"}
            </Button>
            {form.formState.errors.root ? (
                <FieldError errors={[form.formState.errors.root]} />
            ) : null}
        </form>
    )
}