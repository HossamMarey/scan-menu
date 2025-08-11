'use client';

// Language switcher component with persistence and improved UX
// Uses the centralized localization system
import { LANGUAGES, useLanguage } from '@/lib/localization';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { changeLanguage, localInfo, locale } = useLanguage();

  const newLocale = locale === 'ar' ? 'en' : 'ar';
  const newLocalInfo =
    LANGUAGES.find(lang => lang.code === newLocale) || localInfo;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => changeLanguage(newLocale)}
      className="gap-2"
      title={`Switch to ${newLocalInfo.label}`}
    >
      <span>{newLocalInfo.flag}</span>
      <span>{newLocalInfo.label}</span>
    </Button>
  );
}
