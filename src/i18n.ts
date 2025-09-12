import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Eagerly import all locale JSON files at build-time
const modules = import.meta.glob('../locales/*/translation.json', { eager: true }) as Record<string, any>;

function buildResources() {
  const res: Record<string, { translation: any }> = {};
  Object.keys(modules).forEach((key) => {
    // key example: ../locales/en/translation.json
    const match = key.match(/\.\.\/locales\/(.*?)\/translation\.json$/);
    if (match) {
      const lng = match[1];
      const data = modules[key]?.default ?? modules[key];
      if (data) {
        res[lng] = { translation: data };
      }
    }
  });
  return res;
}

export async function setupI18n() {
  const saved = typeof window !== 'undefined' ? localStorage.getItem('app_lang') : null;
  const lng = saved || 'en';

  const resources = buildResources();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      returnEmptyString: false,
    });

  return i18n;
}

export default i18n;


