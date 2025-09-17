// lib/toast.js

let addToastFn = null

export function setAddToastFn(fn) {
  addToastFn = fn
}

export function toast({ title, description }) {
  if (addToastFn) {
    addToastFn({ title, description })
  } else {
    console.warn("Toast not initialized yet. Call toast after <Toaster /> mounts.")
  }
}
