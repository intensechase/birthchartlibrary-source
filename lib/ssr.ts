import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getUser } from '@/lib/auth'

export function withAdminAuth<P extends { [key: string]: any } = { [key: string]: any }>(
  handler?: (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>
): GetServerSideProps<P> {
  return async (context) => {
    const user = await getUser(context)
    if (!user) return { redirect: { destination: '/login', permanent: false } }
    if (!user.is_admin) return { redirect: { destination: '/account', permanent: false } }
    if (handler) return handler(context)
    return { props: {} as P }
  }
}
