import React, { useEffect, useState } from "react"

// NOTE -- check the fetch / response and formatting for the result(s)
export function APIUsage() {
  const [data, setData] = useState()

  useEffect(() => {
    async function fetchData() {
      const d = await fetch(
        "http://www.parrotsour.com/database/api/stats.php",
        {
          method: "GET",
        }
      )

      //@ts-expect-error typed
      setData(d)
    }
    fetchData()
  }, [])

  return <>{data}</>
}
