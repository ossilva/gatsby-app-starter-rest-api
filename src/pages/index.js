import React from 'react'
import { Link } from 'gatsby'
import Layout from 'components/common/Layout'
import SEO from 'components/common/Seo'

export default () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <div className="container center-text">
      <h1>Galeria de los 60 de Lister en Tenerife 2020</h1>
      <h1>Kuvagalleria Lister 60 Tenerife 2020</h1>
      <Link style={{ fontSize: 50 + 'px' }} to="/app/">
        <b>A la galeria</b>
      </Link>
    </div>
  </Layout>
)
