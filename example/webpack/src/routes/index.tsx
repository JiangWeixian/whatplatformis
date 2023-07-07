import React from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import routes from 'virtual:react-pages'

const Routes = () => {
  const element = useRoutes(routes)
  return element
}

const RouterViewer = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>loading...</div>}>
        <Routes />
      </React.Suspense>
    </BrowserRouter>
  )
}

export default RouterViewer
