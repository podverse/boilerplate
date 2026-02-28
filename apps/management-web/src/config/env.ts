/**
 * Management web app env. Use NEXT_PUBLIC_* for client.
 */
export function getManagementApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_MANAGEMENT_API_URL ?? '';
  return url.replace(/\/$/, '');
}
