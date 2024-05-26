const x = isSSR()
const x1 = isSSR?.()
const z = isSSR() || true
const z1 = isSSR?.() || true
const z2 = helper.x.isSSR() || true
const y1 = helper.x.isSSR()
const y2 = helper.isSSR()
if (isSSR()) {
  console.log(1)
}
if (isSSR?.()) {
  console.log(1)
}
[isSSR()]