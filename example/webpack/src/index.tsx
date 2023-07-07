import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'

import App from './App'
import { store } from './store'

const $ROOT = document.querySelector('#app')
const root = createRoot($ROOT)

const renderApp = (Component: any) => {
  root.render(
    <Provider store={store}>
      <Component />
    </Provider>,
  )
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp(App)
})

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.info('SW registered')
      })
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError)
      })
  })
}
