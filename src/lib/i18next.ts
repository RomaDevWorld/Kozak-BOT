import i18next from 'i18next'
import resources from '../locales/resources'

i18next.init({
  debug: true,
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  resources,
})

export default i18next
