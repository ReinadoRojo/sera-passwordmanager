import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sb } from "@/lib/supabase"

import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { errorMessageHandle } from "@/lib/utils"
import { Checkbox } from "../ui/checkbox"
import { toast } from "sonner"

export const RegisterForm = () => {
    const schema = z.object({
        email: z.email({ error: "Invalid email address" }),
        password: z.string().min(8, { error: "The password it too short" }).max(128, { error: "The password may be too long" })
        .refine((password) => /[A-Z]/.test(password), { error: "Please use at least one uppercase character" })
        .refine((password) => /[a-z]/.test(password), { error: "Please use at least one lowercase character" })
        .refine((password) => /[0-9]/.test(password), { error: "Please use at least one number" })
        .refine((password) => /[!@#$%^&.*]/.test(password), { error: "Please use at least one special character" }),
        confirmPassword: z.string(),
        accept: z.boolean({ error: "You must accept the dangers, and also the legal notifications!"})
    }).refine((data) => data.password === data.confirmPassword, { error: "Passwords don't match", path: ["confirmPassword"] });
    
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            accept: false
        }
    })

    async function onSubmit(formData: z.infer<typeof schema>) {
        const { email, password, confirmPassword, accept } = formData;

        if(!accept) {
            return
        }

        if(password !== confirmPassword) {
            form.setError("password", {
                message: "Passwords are not the same."
            })
            form.setError("confirmPassword", {
                message: "Passwords are not the same."
            })
            return;
        }

        const { error } = await sb.auth.signUp({
            email,
            password,
        })

        if(error) {
            const err_msg = errorMessageHandle(error.code)

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

        form.reset();
        toast.success("Account created! Please check your email to verify your account and proceed to log in!", {
            duration: 8000,
            description: "If you don't see the email, please check your spam folder.",
            richColors: true
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState}) => (
                    <Field orientation={"responsive"} data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} aria-invalid={fieldState.invalid}>Email</FieldLabel>
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
                        <FieldLabel htmlFor={field.name} aria-invalid={fieldState.invalid}>Password</FieldLabel>
                        <Input type="password" {...field} aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState}) => (
                    <Field orientation={"responsive"} data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} aria-invalid={fieldState.invalid}>Confirm Password</FieldLabel>
                        <Input type="password" {...field} aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="accept"
                control={form.control}
                render={({ field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="flex flex-row space-x-2 px-4 py-2 items-center bg-accent rounded-md text-accent-foreground">
                            <Checkbox
                                id="accept"
                                name={field.name}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <FieldLabel htmlFor="accept" aria-invalid={fieldState.invalid}>
                                <p className="text-sm [&>a]:underline [&>a]:underline-offset-2">I accept the <a href="#risks" target="_blank">risks</a> and accept all <a href="#legal" target="_blank">legal requirement (ToS & Privacy Policy)</a></p>
                            </FieldLabel>
                        </div>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating account..." : "Create account"}
            </Button>
            {form.formState.errors.root ? (
                <FieldError errors={[form.formState.errors.root]} />
            ) : null}
        </form>
    )
}