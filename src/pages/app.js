import React from 'react'
import { Router } from '@reach/router'
import Provider from 'providers/Provider'
import AppWrapper from 'components/AppWrapper'
import Gallery from 'components/Gallery'
import App from 'components/App'
import Upload from 'components/Upload'
import NotFound from 'components/common/NotFound'
import Login from 'components/Login'

export default () => (
  <Provider>
    <AppWrapper>
      <Router>
        <App path="/app/" component={App} />
        <Login path="/app/login/" component={Login} />
        <Gallery path="/app/gallery/" component={Gallery} />
        <Upload path="/app/gallery/upload/" component={Upload} />
        <NotFound default component={NotFound} />
      </Router>
    </AppWrapper>
  </Provider>
)
