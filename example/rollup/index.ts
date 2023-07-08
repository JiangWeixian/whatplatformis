import { isBrowser, isServer } from 'whatplatformis'

if (typeof window === 'undefined') {
  console.log('Runtime Server side')
}

if (isBrowser) {
  console.log('Browser side')
}

if (isServer) {
  console.log('Server side')
}