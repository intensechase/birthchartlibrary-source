// Firefox/Safari throw a SecurityError ("The operation is insecure") on ANY
// localStorage/sessionStorage access when storage is blocked (strict private
// mode, "block all cookies"). The throw happens on the property access itself,
// not on a missing key — so every call site must be guarded. These helpers
// degrade to no-ops / null instead of crashing the page.

export function safeLocalGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeLocalSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // storage blocked — ignore
  }
}

export function safeSessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeSessionSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // storage blocked — ignore
  }
}

export function safeSessionRemove(key: string): void {
  try {
    sessionStorage.removeItem(key)
  } catch {
    // storage blocked — ignore
  }
}
