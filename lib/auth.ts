const DELETE_PASSWORD = process.env.DELETE_PASSWORD || 'altnpf';

export function verifyDeletePassword(password: string): boolean {
  return password === DELETE_PASSWORD;
}
