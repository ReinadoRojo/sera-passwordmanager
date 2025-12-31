import { createClient } from "@supabase/supabase-js";

// TODO: add this to env and fetch from there
const SUPABASE_URL = "https://xjcmjpkccjushtszrjbj.supabase.co"
const SUPABASE_KEY = "sb_publishable_MSEI_llHCNBehGxdgItN4Q_A3wt4j5Y"

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: {
        schema: "api"
    },
})

export async function isAuthenticated() {
    const { data, error } = await sb.auth.getSession()
    if(error || !data || !data.session?.user) return [false, null]

    return [true, data.session.user]
}

export { sb, sb as supabase}