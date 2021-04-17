import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import Head from 'next/head'
import MainTopBar from '../components/MainTopBar'
import { setAlert } from '../actions/alert'
import { registerUser } from '../actions/auth'
import Alert from '../components/Alert'
import PropTypes from 'prop-types'

const FORM_FIELDS = [
  {
    name: 'username',
    placeholder: 'Username',
    desc:
      'Enter a username. Use only alphanumeric and underscores (No underscores after each other). Must be 5-20 characters.',
    type: 'text'
  },
  {
    name: 'email',
    placeholder: 'Email',
    desc: 'Enter an email. You will have to verify you own it later.',
    type: 'email'
  },
  {
    name: 'password',
    placeholder: 'Password',
    desc: 'Enter an 8-50 character password',
    type: 'password'
  },
  {
    name: 'password2',
    placeholder: 'Confirm Password',
    desc: 'Enter your password again',
    type: 'password'
  }
]

const register = ({ setAlert, registerUser, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  })
  const [showBackBtn, setShowBackBtn] = useState(false)

  const slides = useRef()

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e, index) => {
    e.preventDefault()
    if (index < 3) {
      slides.current.style.transform = `translate(-${25 * (1 + index)}%, 0)`
      setShowBackBtn(true)
    } else {
      const { username, email, password, password2 } = formData
      if (password === password2) {
        registerUser({ username, email, password })
      } else {
        setAlert('Passwords do not match')
      }
    }
  }

  const goBack = (index) => {
    if (index > 0) {
      slides.current.style.transform = `translate(-${25 * (index - 1)}%, 0)`
      index === 1 && setShowBackBtn(false)
    }
  }

  if (isAuthenticated) document.location = 'http://localhost:3000'

  return (
    <>
      <Head>
        <title>Register - Edhcenter</title>
      </Head>
      <MainTopBar />
      <div className='container'>
        <Alert />
        <div className='register-container'>
          <h2 className='register-title'>Register</h2>
          <div className='slides' ref={slides}>
            {FORM_FIELDS.map(({ name, placeholder, desc, type }, index) => (
              <div className='input-slide' key={`is${index}`}>
                <p className='top-text'>{desc}</p>
                <form onSubmit={(e) => submitHandler(e, index)}>
                  <input
                    className='square-input'
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={(e) => changeHandler(e)}
                    required
                  />
                  <button className='ec-button' type='submit'>
                    Next
                  </button>
                </form>
                {showBackBtn && (
                  <div
                    className='ec-button back-btn'
                    onClick={() => goBack(index)}>
                    Back
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, registerUser })(register)
