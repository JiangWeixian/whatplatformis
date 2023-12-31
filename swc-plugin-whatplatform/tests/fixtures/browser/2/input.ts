import { isServer } from "whatplatformis"
import { isBrowser } from "is-server"

if (isServer) {
  console.log(1)
}

if (isBrowser) {
  console.log(1)
}

if (true) {
  console.log(1)
}

const x = isServer