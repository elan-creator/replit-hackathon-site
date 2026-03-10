const SITE_USERNAME = process.env.SITE_USERNAME || 'mfl';
const SITE_PASSWORD = process.env.SITE_PASSWORD || 'replit';
const AUTH_SECRET = process.env.AUTH_SECRET || 'vibe-workshop-2026-secret';

export async function generateAuthToken(): Promise<string> {
  const data = new TextEncoder().encode(`${SITE_USERNAME}:${SITE_PASSWORD}:${AUTH_SECRET}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAuthToken(token: string): Promise<boolean> {
  try {
    const expected = await generateAuthToken();
    return token === expected;
  } catch {
    return false;
  }
}
