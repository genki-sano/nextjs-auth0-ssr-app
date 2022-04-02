import '@/styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0'
import type { AppProps } from 'next/app'

const MyApp: React.VFC<AppProps> = ({ Component, pageProps }) => {
  const { user } = pageProps

  return (
    <UserProvider user={user}>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
