import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loginUser } from '../actions/auth'
import MainTopBar from '../components/MainTopBar'
import Alert from '../components/Alert'

const login = ({ loginUser, isAuthenticated }) => {
  const [formValues, setFormValues] = useState({
    username: '',
    password: ''
  })

  const submitHandler = (e) => {
    e.preventDefault()
    loginUser(formValues)
  }

  if (isAuthenticated) document.location = 'http://localhost:3000'

  return (
    <>
      <Head>
        <title>Log in - Edhcenter</title>
      </Head>
      <MainTopBar />
      <div className='container'>
        <Alert />
        <div className='login-container'>
          <h2>Log in</h2>
          <form className='login' onSubmit={submitHandler}>
            <div className='input-container'>
              <label>Username</label>
              <input
                type='text'
                className='square-input'
                minLength='5'
                maxLength='20'
                required
                onChange={(e) =>
                  setFormValues({ ...formValues, username: e.target.value })
                }
              />
            </div>
            <div className='input-container'>
              <label>Password</label>
              <input
                type='password'
                className='square-input'
                minLength='8'
                maxLength='50'
                required
                onChange={(e) =>
                  setFormValues({ ...formValues, password: e.target.value })
                }
              />
            </div>
            <button type='submit' className='ec-button'>
              Log in
            </button>
          </form>
          <Link href='/forgotpassword'>Forgot Password</Link> |{' '}
          <Link href='/register'>Register</Link>
        </div>
      </div>
    </>
  )
}

login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { loginUser })(login)
