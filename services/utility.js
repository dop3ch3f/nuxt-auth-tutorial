export default class UtilityService {
  // check if is same url
  isSameURL = (a, b) => a.split('?')[0] === b.split('?')[0];

  normalizePath (path = '') {
    // Remove query string
    let result = path.split('?')[0]

    // Remove redundant / from the end of path
    if (result.charAt(result.length - 1) === '/') {
      result = result.slice(0, -1)
    }

    return result
  }

  pipe = (f, g) => (...args) => g(f(...args));

  checkIfVueInstanceOrNuxtContext = (process, data) => {
    if (process.server) {
      return true
    }
    if (data.app != null) {
      return true
    }
    return false
  };
}
