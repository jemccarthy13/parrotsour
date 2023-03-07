import React, { useEffect, useState } from "react"

export function APIUsage() {
  const [data, setData] = useState()

  useEffect(() => {
    async function fetchData() {
      const d = await fetch(
        process.env.PUBLIC_URL + "/database/api/stats.php",
        {
          method: "GET",
        }
      )

      console.log(d.json())
      //@ts-expect-error typed
      setData(d)
    }
    fetchData()
  }, [])

  return <>{data}</>
}
