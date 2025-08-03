import { Metadata } from 'next'
import { NotFoundPage } from '@/components/ui/NotFoundPage'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Kawa Leaves Coffee',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return <NotFoundPage showMenuLinks={true} showDecorations={true} />
}
