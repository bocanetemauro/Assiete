/**
 * Demo-authenticatie. Wachtwoorden worden gehasht (SHA-256) en lokaal bewaard.
 * Dit is uitsluitend bedoeld voor de lokale demo — koppel voor productie een
 * echte provider (Auth.js, Supabase Auth, Clerk…) en verwijder password_hash.
 */

export async function hashPassword(email: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`assiette:${email.trim().toLowerCase()}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Vul je e-mailadres in.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Dit lijkt geen geldig e-mailadres.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Kies een wachtwoord van minstens 8 tekens.";
  return null;
}

export function validateName(name: string): string | null {
  if (name.trim().length < 2) return "Vul je naam in.";
  return null;
}
