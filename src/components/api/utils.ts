export async function validAccessCode(accessCode: string) {
  const resp = await fetch(
    `${process.env.PUBLIC_URL}/database/codes/${accessCode}.php`,
    {
      method: "POST",
    }
  )

  return resp.status === 202
}
