export const generateCredentials = async (
  _secret: string,
  _turnServers: readonly string[]
) => ({
  iceServers: [
    { urls: 'stun:turn.comprom.org:3478' },
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:turn.comprom.org:3478',
      username: 'wemon',
      credential: 'vvemon1995',
    },
    {
      urls: 'turn:turn.comprom.org:3478?transport=tcp',
      username: 'wemon',
      credential: 'vvemon1995',
    },
  ],
  ttl: 21600,
})
