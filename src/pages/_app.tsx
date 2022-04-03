import '@/styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0'
import { AppProps } from 'next/app'

const MyApp: React.VFC<AppProps> = ({ Component, pageProps }) => {
  return (
    <UserProvider user={pageProps.user}>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
