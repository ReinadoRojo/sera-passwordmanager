import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Clipboard } from "lucide-react";
import { isAuthenticated, sb } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type VaultObject = {
    id: number;
    domain: string;
    blob: string;
    iv: string;
    filter: string;
}

const VaultObject = ({ object, idx }: { object: VaultObject, idx: number }) => {
    const even = idx % 2 === 0;
    return (
        <div className={cn("flex flex-row justify-between py-2 px-6 border rounded-md items-center", even ? "bg-accent/10 border-accent/40" : "bg-accent/40 border-accent/40")}>
            <h2>{object.domain}</h2>
            <Button size={"icon-sm"} variant={"secondary"}>
                <Clipboard className="size-4"/>
            </Button>
        </div>
    )
}

export const VaultList = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        let cancelled = false;

        isAuthenticated().then(([authenticated, u]) => {
            if(cancelled) return;
            if(authenticated && u) {
                setUser(u);
            }
            setLoading(false);
        }).catch(() => {
            if(cancelled) return;
            setLoading(false);
        });

        return () => {
            cancelled = true;
        }
    }, [])

    if(!loading && !user) {
        return <p>Please sign in to view your vault.</p>; // Weird case (it would be an error)
    }

    if(loading) {
        return (
            <>
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-12" />
            </>
        )
    }

    const objects: VaultObject[] = [{ id: 1, domain: 'example.com', blob: 'blobdata', iv: 'ivdata', filter: 'all' }, { id: 2, domain: 'sub.example.com', blob: 'blobdata', iv: 'ivdata', filter: 'all' }];
    
    return (
        <>
            {objects.length === 0 && (
                <p>Your vault is empty. Start by adding new entries!</p>
            )}
            {objects.map((obj, idx) => (
                <VaultObject key={obj.id} object={obj} idx={idx} />
            ))}
        </>
    )
}