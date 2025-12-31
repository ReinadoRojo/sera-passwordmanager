import type { AuthError } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function errorMessageHandle(supabaseErrorCode: AuthError["code"]): string {
  switch (supabaseErrorCode) {
    case "invalid_credentials":
      return "Credentials are invalid!";
    case "email_not_confirmed":
      return "Email has not been verified! Please check for emails in your inbox."
    case "request_timeout":
      return "Our authentication server is having throubles. We're working on solving it!"
    case "user_banned":
      return "This user is banned from our service. Contact support if you belive this is an error."
    case "weak_password":
      return "The password used it's prohibeted because of weak security."
    case "email_address_invalid":
      return "The email provided is invalid or does not meet the trust standards of this application. You may require using a valid email and not a temporal one."
    default:
      return "Auth provider cannot process the request, reason can vary, contact support."
  }
}