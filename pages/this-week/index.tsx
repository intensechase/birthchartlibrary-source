import { GetServerSideProps } from 'next'
import { getMondayOfWeek } from '@/lib/swisseph/weekly-sky'

export const getServerSideProps: GetServerSideProps = async () => {
  const monday = getMondayOfWeek(new Date())
  const date = `${monday.getUTCFullYear()}-${String(monday.getUTCMonth() + 1).padStart(2, '0')}-${String(monday.getUTCDate()).padStart(2, '0')}`

  return {
    redirect: {
      destination: `/this-week/${date}`,
      permanent: false,
    },
  }
}

// This page never renders — it always redirects
export default function ThisWeekRedirect() {
  return null
}
