
export function setCookie(name: string, value: string) {
  const expires = new Date();
  expires.setTime(expires.getTime() + 60 * 60 * 1000); // 1 hour
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

export function getCookie(name: string) {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

export function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
