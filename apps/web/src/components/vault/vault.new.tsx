import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Controller, useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FingerprintPatternIcon } from "lucide-react"
import { generateSafePassword } from "@/lib/utils"


const webLoginSchema = z.object({
    type: z.literal("web_login"),
    domain: z.string().min(1, "Domain is required").max(255, "Domain is too long"),
    username: z.string().min(1, "Username is required").max(255, "Username is too long"),
    password: z.string().min(1, "Password is required").max(500, "Password is too long"),
    note: z.string().max(40, "Note text is too long").optional(),
})

const secureNoteSchema = z.object({
    type: z.literal("secure_note"),
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    content: z.string().min(1, "Content is required").max(2000, "Content is too long"),
})

// TODO: I would like to add more schemas later (credit cards, bank accounts, etc)

const unifiedSchema = z.discriminatedUnion("type", [
    webLoginSchema,
    secureNoteSchema,
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WebLoginForm = ({ form }: { form: UseFormReturn<any> }) => (
    <div className="space-y-4">
        <Controller
            control={form.control}
            name="domain"
            render={({ field, fieldState }) => (
                <Field orientation={"responsive"} data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} aria-invalid={fieldState.invalid}>Domain</FieldLabel>
                    <Input type="text" placeholder="example.com" {...field} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
        <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
                <Field orientation={"responsive"} data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} aria-invalid={fieldState.invalid}>Username</FieldLabel>
                    <Input type="text" {...field} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
        <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
                <Field orientation={"vertical"} data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} aria-invalid={fieldState.invalid}>Password</FieldLabel>
                    <div className="flex flex-row items-center space-x-2">
                        <Input type="password" {...field} aria-invalid={fieldState.invalid} className=""/>
                        <Button size={"icon"} variant={"outline"} title="Generate" type="button" onClick={() => {
                            form.setValue("password", generateSafePassword(24, 0)) // TODO: Allow user to customize these settings...
                        }}>
                            <FingerprintPatternIcon />
                        </Button>
                    </div>
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    </div>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SecureNoteForm = ({ form }: { form: UseFormReturn<any> }) => (
    <div className="space-y-4">
        <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
                <Field orientation={"responsive"} data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} aria-invalid={fieldState.invalid}>Content</FieldLabel>
                    <Input type="text" placeholder="Title" {...field} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
        <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
                <Field orientation={"responsive"} data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} aria-invalid={fieldState.invalid}>Content</FieldLabel>
                    <Textarea {...field} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    </div>
)

export const VaultNewDialog = ({ children }: { children: React.ReactNode }) => {
    const form = useForm({
        resolver: zodResolver(unifiedSchema),
        defaultValues: {
            domain: "",
            username: "",
            password: "",
            type: "web_login",
        }
    })

    async function onSubmit(formData: z.infer<typeof unifiedSchema>) {
        console.log(formData);

        switch (formData.type) {
            case "web_login":

                break;
            case "secure_note":
                // TODO: Add secure notes
                break;
            default:
                break;
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-md">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>
                            Create new vault entry
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new entry in your vault.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 w-full">
                        <Tabs defaultValue="web_login" onValueChange={(val) => { form.setValue("type", val as "web_login" | "secure_note") }}>
                            <TabsList className="w-full">
                                <TabsTrigger value="web_login">Login</TabsTrigger>
                                <TabsTrigger value="secure_note">Secure note</TabsTrigger>
                            </TabsList>
                            <TabsContent value="web_login">
                                <WebLoginForm form={form} />
                            </TabsContent>
                            <TabsContent value="secure_note">
                                <SecureNoteForm form={form} />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <DialogFooter className="flex flex-row justify-between w-full mt-3 items-center">
                        <Button onClick={() => {}} className="w-full" variant={"secondary"} disabled={false} type="submit">
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}