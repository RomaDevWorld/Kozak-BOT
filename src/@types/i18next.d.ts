import resources from './src/locales/resources'
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: typeof resources
  }
}
