const CREDENTIAL_TTL_SECONDS = 21_600

const encoder = new TextEncoder()

const hmacSign = async (
  secret: string,
  data: string
): Promise<string> => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  )

  return btoa(
    String.fromCharCode(
      ...new Uint8Array(signature)
    )
  )
}

export const generateCredentials = async (
  secret: string,
  turnServers: readonly string[],
  staticUser?: string,
  staticPass?: string
) => {
  const stun = turnServers.map(
    s => `stun:${s}:3478`
  )

  if (staticUser && staticPass) {
    return {
      iceServers: [
        { urls: stun },
        ...turnServers.flatMap(s => [
          {
            urls: `turn:${s}:3478`,
            username: staticUser,
            credential: staticPass,
          },
          {
            urls: `turn:${s}:3478?transport=tcp`,
            username: staticUser,
            credential: staticPass,
          },
        ]),
      ],
      ttl: CREDENTIAL_TTL_SECONDS,
    }
  }

  const expiry =
    Math.floor(Date.now() / 1000) +
    CREDENTIAL_TTL_SECONDS

  const username = `${expiry}:rtc-less`
  const credential = await hmacSign(
    secret,
    username
  )

  return {
    iceServers: [
      { urls: stun },
      ...turnServers.flatMap(s => [
        {
          urls: `turn:${s}:3478?transport=udp`,
          username,
          credential,
        },
        {
          urls: `turn:${s}:3478?transport=tcp`,
          username,
          credential,
        },
      ]),
    ],
    ttl: CREDENTIAL_TTL_SECONDS,
  }
}
