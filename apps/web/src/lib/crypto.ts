import { decryptData, encryptData } from "@vault/crypto";
import { isAuthenticated, sb } from "./supabase";
import { VALID_CANARIO_TEXT } from "./utils";

export async function isValidMasterPassword(masterPasswordInput: string): Promise<[boolean, string]> {
    const { data: sp } = await sb.from("security_profile").select("*").maybeSingle();
    if(!sp) return [false, "Security profile not found"];

    try {
        const { kdf_salt, canario_blob, canario_iv } = sp

        const plainTextData = await decryptData(canario_blob, kdf_salt, canario_iv, masterPasswordInput)

        const isValid = plainTextData === VALID_CANARIO_TEXT
        return [isValid, !isValid ? "Decryption result failed obtaining a secure string" : ""]
    } catch {
        return [false, "Decryption process failed or the enviroment isn't secure"]
    }
}

export async function createSecurityProfile(masterPasswordInput: string) {
    const [isAuth, user] = await isAuthenticated()
    if(!isAuth || !user) return false;

    const { blob, iv, salt } = await encryptData(VALID_CANARIO_TEXT, masterPasswordInput)
    
    const { error } = await sb.from("security_profile").insert({ user_id: user.id, kdf_salt: salt, canario_blob: blob, canario_iv: iv });

    if(error) {
        console.log(`error code=${error.code} msg=${error.message}`)
        return false;
    }

    return true;
}