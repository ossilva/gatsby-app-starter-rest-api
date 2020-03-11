import React, { useState, useEffect, useContext } from 'react'
import { navigate } from 'gatsby'
import setAuthToken from 'helpers/setAuthToken'
import Layout from 'components/common/Layout'
import Context from './common/Context'

//client side only
import Loadable from '@loadable/component'
import axios from 'axios'

const AppWrapper = ({ children }) => {
  const { user, dispatchUserAction } = useContext(Context)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const token = window.localStorage.getItem('token')
      if (token) {
        const { data } = await axios({
          method: 'GET',
          url: `${process.env.API}/user/verify`,
          headers: {
            'Content-Type': 'text/plain',
            'x-auth': token,
          },
        })

        await setAuthToken(data.token)
        dispatchUserAction({ type: 'SAVE_USER', payload: 'any' })
        window.localStorage.setItem('token', data.token)

        if (
          window.location.pathname === '/app/login' ||
          window.location.pathname === '/app/register' ||
          window.location.pathname === '/app' ||
          window.location.pathname === '/app/login/' ||
          window.location.pathname === '/app/register/' ||
          window.location.pathname === '/app/'
        ) {
          navigate('/app/gallery/')
        }
        setLoading(false)
      } else {
        if (
          window.location.pathname === '/app/gallery' ||
          window.location.pathname === '/app/gallery/' ||
          window.location.pathname === '/app/upload' ||
          window.location.pathname === '/app/upload/'
        ) {
          navigate('/app/login/')
        }
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
    }
  }

  const logout = () => {
    try {
      dispatchUserAction({ type: 'LOGOUT' })
      window.localStorage.removeItem('token')
      setAuthToken(false)
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!user.isLoggedIn) {
      fetchUser()
    }
  }, [])

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <Layout isLoggedIn={user.isLoggedIn} logout={logout}>
          {children}
        </Layout>
      )}
    </>
  )
}

const LoadableAppWrapper = Loadable(() => import('./AppWrapper'))

export default AppWrapper
