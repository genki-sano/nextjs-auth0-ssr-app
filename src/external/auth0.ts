import { ParsedUrlQuery } from 'querystring'
import { getSession, PageRoute, Session } from '@auth0/nextjs-auth0'
import { getLoginUrl } from '@auth0/nextjs-auth0/dist/config'
import { assertCtx } from '@auth0/nextjs-auth0/dist/utils/assert'
import jwt from 'jsonwebtoken'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

export type WithPageAuthRequiredOptions<P> = {
  getServerSideProps?: GetServerSideProps<P>
  returnTo?: string
}

export type GetServerSideProps<P> = (
  context: GetServerSidePropsContextWithSession,
) => Promise<GetServerSidePropsResult<P>>

export type GetServerSidePropsContextWithSession = GetServerSidePropsContext & {
  session: Session
}

// @see https://github.com/auth0/nextjs-auth0/blob/main/src/helpers/with-page-auth-required.ts#L102-L131
export const withPageAuthRequired = <
  P = any,
  Q extends ParsedUrlQuery = ParsedUrlQuery,
>(
  opts?: WithPageAuthRequiredOptions<P>,
): PageRoute<P, Q> => {
  return async (ctx) => {
    assertCtx(ctx)
    let session = getSession(ctx.req, ctx.res)
    if (!session?.user) {
      return {
        redirect: {
          destination: `${getLoginUrl()}?returnTo=${encodeURIComponent(
            opts?.returnTo || ctx.resolvedUrl,
          )}`,
          permanent: false,
        },
      }
    }
    session = setAccessToken(session)

    let ret: any = { props: {} }
    if (opts?.getServerSideProps) {
      ret = await opts.getServerSideProps({ ...ctx, session })
    }

    return { ...ret, props: { ...ret.props, user: session.user } }
  }
}

export const setAccessToken = (session: Session): Session => {
  const now = Math.floor(Date.now() / 1000)
  // クロックスキューが発生する可能性があるので、判定に1分だけ余裕を持たせる
  if (
    session.user.accessToken &&
    session.user.accessTokenExpiresAt - 60 > now
  ) {
    return session
  }

  if (!process.env.SUPABASE_JWT_SECRET) {
    throw new Error('Supabase JWT secret is required.')
  }

  const expiresAt = now + 30 * 60
  const payload = {
    userId: session.user.sub,
    exp: expiresAt,
  }

  session.user.accessToken = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET)
  session.user.accessTokenExpiresAt = expiresAt

  return session
}
