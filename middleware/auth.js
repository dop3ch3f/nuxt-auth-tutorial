import UtilityMethods from '../services/utility'

// setup utility methods
const { pipe, isSameURL, normalizePath } = new UtilityMethods()

const routeGuards = (...fns) => {
  return fns.reduce(pipe)
}

/**
 * Checks if user is already logged in through the Store
 *
 * @param {$store} store - Vuex Store
 * @return {boolean} true if user exists but false if otherwise
 */
const ifUser = (store) => {
  return store.getters['auth/getUser'] !== ''
}

/**
 * Redirect handler function to redirect and to prevent redirect loops.
 *
 * @param {string} to - path to redirect to
 * @param {string} from - path from needed only for client as server is stateless
 * @param {Nuxt} context - Nuxt context available on the server and client
 */
const redirect = (to, from, context) => {
  // prevent redirect loop
  if (process.client) {
    if (isSameURL(to, context.from.path)) {
      return
    }
    return context.redirect(to)
  }
  return context.redirect(to)
}

/**
 * Route Guard Main Method that uses pipe to process each request (through route guards fns) and provide the correct call to redirect based on auth status
 *
 * @param {Nuxt} context - nuxt context available both on server and client
 * @return {null} returns null
 */
const routeAuthProcessor = (context) => {
  const route = context.route.fullPath

  const result = routeGuards(
    initialRouteGuard,
    unguardedRouteGuard,
    guardedRouteGuard
  )({ to: route, destination: null, processed: false, context })

  if (result.processed === true && result.destination !== null) {
    return redirect(result.destination, result.from, context)
  }
}

/**
 * Route Guard to prevent hitting base url. (i.e) Redirect you to home if logged in and login if not logged in
 *
 * @param {Object} data - data object already prepared by parent function routeAuthProcessor
 * @return {Object} data - data object that is processed if user actually hits base url else untouched and passed to next
 */
const initialRouteGuard = (data) => {
  // if user hits base route and is logged in redirect to home
  // if user hits base route and is not logged in
  // if user hits base route and is logged in but no store
  const { store } = data.context
  if (data.to === '/' && data.processed === false) {
    if (ifUser(store)) {
      data.destination = '/home'
      data.processed = true
    } else {
      data.destination = '/login'
      data.processed = true
    }
  }
  return data
}

/**
 * Route Guard to allow hitting of specific routes termed as unguarded routes e.g /login, /register.
 *
 * @param {Object} data - data object already prepared by parent function routeAuthProcessor
 * @return {Object} data - data object that is processed if user hit an unguarded route else untouched and passed to next
 */
const unguardedRouteGuard = (data) => {
  // if user hits an unguarded route allow
  const unguardedRoutes = [
    '/login'
  ]

  if (
    unguardedRoutes.includes(
      normalizePath(data.to)
    ) &&
    data.processed === false
  ) {
    data.destination = null
    data.processed = true
  }

  return data
}

/**
 * Route Guard to allow hitting of guarded routes only if authenticated.
 *
 * @param {Object} data - data object already prepared by parent function routeAuthProcessor
 * @return {Object} data - data object that is processed if user hit a guarded route else untouched and passed to redirect
 */
const guardedRouteGuard = (data) => {
  // if user hits a guarded route check status
  const { store } = data.context
  if (data.processed === false) {
    // if user is not logged in
    if (!ifUser(store)) {
      data.destination = '/login'
      data.processed = true
    } else {
      // if user is logged in let him pass
      data.destination = null
      data.processed = true
    }
  }
  return data
}

export default (context) => {
  return routeAuthProcessor(context)
}
