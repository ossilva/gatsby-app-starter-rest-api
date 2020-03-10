import React from 'react'
import { Link } from 'gatsby'
import Image from 'components/Image'
import SEO from 'components/common/Seo'

export default () => (
  <>
    <SEO title="App" keywords={[`gatsby`, `application`, `react`]} />
    <div className="container center-text">
      <div style={{ maxWidth: `700px`, margin: `0 auto 3rem auto` }}>
        <Image />
      </div>
      <div>
        <Link className="btn btn-rounded gradient-purple" to="/app/login/">
          Login
        </Link>
      </div>
    </div>
  </>
)
