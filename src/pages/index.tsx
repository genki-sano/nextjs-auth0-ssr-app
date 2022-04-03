import { NextPage } from 'next'
import Head from 'next/head'
import { Index } from '@/component/Index'
import { ToDo, TODO_TABLE_NAME } from '@/models/todo'
import { User } from '@/models/user'
import { withPageAuthRequired } from '@/utils/auth0'
import { getSupabase } from '@/utils/supabase'

interface Props {
  user: User
  todos: ToDo[]
}

const IndexPage: NextPage<Props> = ({ user, todos }) => {
  return (
    <>
      <Head>
        <title>Next Auth0 SSR App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Index user={user} todos={todos} />
    </>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ session }) {
    const supabase = getSupabase(session.user.accessToken)

    const { error, data } = await supabase
      .from<ToDo>(TODO_TABLE_NAME)
      .select('*')
    if (error) {
      throw new Error(error.message)
    }

    return {
      props: { todos: data },
    }
  },
})

export default IndexPage
