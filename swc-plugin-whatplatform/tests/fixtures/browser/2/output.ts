import { isBrowser } from 'is-server'
import { isServer } from 'whatplatformis'

if (false) {
  console.log(1)
}

if (isBrowser) {
  console.log(1)
}

if (true) {
  console.log(1)
}

const x = false
