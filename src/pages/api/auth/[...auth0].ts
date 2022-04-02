import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

const afterCallback = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
): Promise<Session> => {
  if (!process.env.SUPABASE_JWT_SECRET) {
    throw new Error('SUPABASE_JWT_SECRET is required.')
  }

  const payload = {
    userId: session.user.sub,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  }

  session.user.accessToken = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET)

  return session
}

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error: any) {
      res.status(error.status || 500).end(error.message)
    }
  },
})
