import { useState } from "react"
import { Cookies } from "react-cookie-consent"

export const useCookieBoolState = (cookieToWatch: string) => {
  const [cookieValue, setCookieValue] = useState(
    Cookies.get(cookieToWatch) === "true"
  )

  const toggleCookie = () => {
    setCookieValue((prev) => {
      Cookies.set(cookieToWatch, !prev)

      return !prev
    })
  }

  return { cookieValue, toggleCookie }
}
