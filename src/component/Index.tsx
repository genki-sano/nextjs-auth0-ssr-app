import Link from 'next/link'
import { ToDo } from '@/libs/models/todo'
import { User } from '@/libs/models/user'
import styles from '@/styles/Home.module.css'

interface Props {
  user: User
  todos: ToDo[]
}

export const Index: React.VFC<Props> = ({ user, todos }) => {
  return (
    <div className={styles.container}>
      <p>
        Welcome {user.name}!{' '}
        <Link href='/api/auth/logout'>
          <a>Logout</a>
        </Link>
      </p>
      {todos?.length > 0 ? (
        todos.map((todo) => <p key={todo.id}>{todo.content}</p>)
      ) : (
        <p>You have completed all todos!</p>
      )}
    </div>
  )
}
