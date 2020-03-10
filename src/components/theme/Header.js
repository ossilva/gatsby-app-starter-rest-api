import { Link } from 'gatsby'
import React from 'react'
import { navigate } from '@reach/router'

export default ({ siteTitle, isLoggedIn, logout }) => (
  <header
    style={{
      background: `rebeccapurple`,
      marginBottom: `1.45rem`,
      padding: '1rem 0',
    }}
  >
    <div className="flex-container container">
      <div className="text-left">
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
      </div>
      {isLoggedIn && (
        <div className="text-right">
          <button
            type="button"
            onClick={() => {
              navigate('/app/gallery')
            }}
            className="btn btn-primary gradient-green"
          >
            gallery
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/app/gallery/upload')
            }}
            className="btn btn-primary gradient-green"
          >
            upload
          </button>
          <button
            type="submit"
            onClick={logout}
            className="btn btn-primary gradient-green"
          >
            logout
          </button>
        </div>
      )}
    </div>
  </header>
)
