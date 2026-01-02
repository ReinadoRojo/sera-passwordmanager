import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"


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

const ObjectForm = () => {
    const form = useForm({
        resolver: zodResolver(unifiedSchema),
        defaultValues: {
            domain: "",
            username: "",
            password: "",
            type: "web_login",
        }
    })

    return (
        <Form>
            <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel />
                        <FormControl>
                            <Input type="text" placeholder="example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel />
                        <FormControl>
                            <Input type="text" placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel />
                        <FormControl>
                            <Input type="password" placeholder="Password" {...field} />
                            <Button size={"sm"} variant={"ghost"}>
                                Generate
                            </Button>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel />
                        <FormControl>
                            <Input type="text" placeholder="Note" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </Form>
    )
}

const TypeSelector = () => {
    return (
        <Select>
            <SelectTrigger>
                <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="web_login">Web Login</SelectItem>
                    <SelectItem value="secure_note">Secure Note</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export const VaultNewDialog = ({ children }: { children: React.ReactNode }) => {
    const [type, setType] = useState<string | null>(null);

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-md">
                <DialogHeader>
                    <DialogTitle>
                        Create new vault entry
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new entry in your vault.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <TypeSelector />
                    {type !== null && (
                        <ObjectForm />
                    )}
                </div>
                <DialogFooter className="flex flex-row justify-between w-full mt-3 items-center">
                    <Button onClick={() => { }} className="ml-auto" disabled={false}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}