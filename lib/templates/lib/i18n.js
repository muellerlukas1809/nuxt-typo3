import { SET_LOCALE } from '~typo3/store/mutation-types'

/**
 * Get language code from path
 *
 * @param {Object} context - Nuxt context
 * @returns {String} localCode
 *
 */
function getLocaleByPath({ isHMR, app, store, params }) {
  if (isHMR) return
  // get first path pram
  // e.g. en/path - get en
  const localeCode = params.pathMatch && params.pathMatch.split('/')[0]

  // check if received locale exist in our locales array
  if (
    store.state.typo3.initial.languages &&
    store.state.typo3.initial.languages.find(
      locale => locale.twoLetterIsoCode === localeCode
    )
  ) {
    return localeCode // if localCode doesn't exist and current locale is not fallback locale
  }

  return app.i18n.fallbackLocale
}

/**
 * Set localCode for store/i18n settings and get initial data with correct lang
 *
 * @param {Object} Context - Nuxt context
 * @param {String} localeCode - String with locale code eg: "pl"
 * @returns {Promise}
 */
function setLocale({ app, store, params }, localeCode) {
  return new Promise((resolve, reject) => {
    if (localeCode) {
      store
        .dispatch('getInitialData', { path: params.pathMatch })
        .then(response => {
          store.commit(SET_LOCALE, localeCode)
          app.i18n.locale = localeCode
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    }
  })
}

export { getLocaleByPath, setLocale }