import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sb } from "@/lib/supabase"

import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { errorMessageHandle } from "@/lib/utils"

export const LoginForm = () => {
    const schema = z.object({
        email: z.email({ error: "Invalid email address" }),
        password: z.string().min(1),
    })
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    async function onSubmit(formData: z.infer<typeof schema>) {
        const { email, password } = formData;

        const { data, error } = await sb.auth.signInWithPassword({
            email,
            password
        })

        if(error) {
            const err_msg = errorMessageHandle(error.code)
            form.resetField("password")
            form.setError("email", {
                message: "",
                type: "validate",
            })
            form.setError("password", {
                message: "",
                type: "validate",
            })
            form.setError("root", {
                message: err_msg,
                type: "validate",
            })

            return;
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