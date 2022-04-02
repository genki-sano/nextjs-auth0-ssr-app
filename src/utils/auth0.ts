import { IncomingMessage, ServerResponse } from 'http'
import { getSession, Session } from '@auth0/nextjs-auth0'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

export const getAuth0Session = async (
  req: IncomingMessage | NextApiRequest,
  res: ServerResponse | NextApiResponse,
): Promise<Session | undefined> => {
  const session = await getSession(req, res)
  if (!session) {
    return
  }

  // supabaseへの接続用にトークンを発行する
  if (process.env.SUPABASE_JWT_SECRET) {
    const payload = {
      userId: session.user.sub,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1h
    }

    session.user.accessToken = jwt.sign(
      payload,
      process.env.SUPABASE_JWT_SECRET,
    )
  }

  return session
}
