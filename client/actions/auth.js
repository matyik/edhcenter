import axios from 'axios'
import cookie from 'js-cookie'
import { setAlert } from './alert'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT
} from './types'
import setAuthToken from '../utils/setAuthToken'

// Load User
export const loadUser = () => async (dispatch) => {
  if (cookie.get('token')) {
    setAuthToken(cookie.get('token'))
  }

  try {
    const res = await axios.get('http://localhost:5000/api/auth/me')

    dispatch({ type: USER_LOADED, payload: res.data })
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

// Register User
export const registerUser = ({ username, email, password }) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const body = JSON.stringify({ username, email, password })
  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/register',
      body,
      config
    )
    dispatch({ type: REGISTER_SUCCESS, payload: res.data.data })
    dispatch(loadUser())
  } catch (err) {
    const error = err.response.data.error
    if (error) {
      dispatch(setAlert(error))
    }
    dispatch({ type: REGISTER_FAIL })
  }
}

// Login User
export const loginUser = ({ username, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const body = JSON.stringify({ username, password })
  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/login',
      body,
      config
    )

    dispatch({ type: LOGIN_SUCCESS, payload: res.data })
    dispatch(loadUser())
  } catch (err) {
    const error = err.response.data.error
    if (error) {
      dispatch(setAlert(error))
    }
    dispatch({ type: LOGIN_FAIL })
  }
}

// Log out user
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT })
}
