import { useState } from "react"
import { Cookies } from "react-cookie-consent"

export const useCookieNumber = (cookieToWatch: string) => {
  const [cookieValue, setCookieValue] = useState<number>(
    parseInt(Cookies.get(cookieToWatch))
  )

  const setCookie = (value: number) => {
    setCookieValue(() => {
      Cookies.set(cookieToWatch, value)

      return value
    })
  }

  return { cookieValue, setCookie }
}
