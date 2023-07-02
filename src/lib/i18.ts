import uk from '../locales/uk.json'
import en from '../locales/en.json'
import i18next from 'i18next'

i18next.init({
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en,
    },
    uk: {
      translation: uk,
    },
  },
})

export default i18next
