// Redirect the root route to the default locale (en)
// This keeps the App Router clean and ensures i18n URLs like /en and /ar
import { defaultLocale } from '@/lib/localization';
import { redirect } from 'next/navigation';

export default function Home(): null {
  redirect('/' + defaultLocale !== 'en' ? defaultLocale : '');
}
