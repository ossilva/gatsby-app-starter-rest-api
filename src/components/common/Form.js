import React, { useContext, useState } from 'react'
import { navigate } from 'gatsby'
import Context from 'components/common/Context'

//client-side only
import Loadable from '@loadable/component'
import axios from 'axios'
import setAuthToken from 'helpers/setAuthToken'

const Form = ({ form }) => {
  const { dispatchUserAction } = useContext(Context)
  const [isSubmitting, setSubmitting] = useState(false)
  const [details, setDetails] = useState({
    password: '',
  })
  const [errors, setErrors] = useState({
    password: '',
  })

  const handleChange = e => {
    setDetails({ ...details, [e.target.name]: e.target.value })
  }

  const handleBlur = e => {
    if (!e.target.value) {
      setErrors({ ...errors, [e.target.name]: 'Required field' })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { password } = details

      if (form === 'login') {
        if (!password) {
          setSubmitting(false)
          setErrors({
            ...errors,
            password: 'Field is required',
          })
        } else {
          const { data } = await axios.post(`${process.env.API}/user/login`, {
            password,
          })

          await setAuthToken(data.token)
          dispatchUserAction({ type: 'SAVE_USER', payload: data })
          window.localStorage.setItem('token', data.token)
          navigate('/app/gallery/')
        }
      }
    } catch (err) {
      setErrors({
        ...errors,
        email: err.response.data.error,
      })
      setSubmitting(false)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="input-field black-input">
          <span className="lock-icon" />
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            type="password"
            placeholder="secreto/tunnussana"
            name="password"
          />
          {errors.password && (
            <span style={{ color: 'red' }}>{errors.password}</span>
          )}
        </div>
        <div className="center-text">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-rounded gradient-green"
          >
            ENTRAR/SISÄÄN
          </button>
        </div>
      </form>
    </div>
  )
}

const LoadableForm = Loadable(() => import('./Form'))

export default Form
