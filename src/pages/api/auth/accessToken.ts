import { getSession } from '@auth0/nextjs-auth0'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setAccessToken } from '@/external/auth0'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const session = getSession(req, res)
  if (!session?.user) {
    res.status(401).end('401 Unauthorized')
    return
  }

  const { user } = setAccessToken(session)
  res.status(200).json({ accessToken: user.accessToken })
}

export default handler
