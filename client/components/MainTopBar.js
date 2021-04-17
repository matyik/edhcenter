import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const MainTopBar = ({
  clickTrigger,
  auth: { isAuthenticated, loading, user }
}) => {
  return (
    <div className='main-topbar'>
      <div className='nav-hamburger' onClick={clickTrigger}>
        <svg viewBox='0 0 100 80' width='40' height='40'>
          <rect stroke='fff' width='100' height='20'></rect>
          <rect stroke='fff' y='30' width='100' height='20'></rect>
          <rect stroke='fff' y='60' width='100' height='20'></rect>
        </svg>
      </div>
      <div className='nav-items'>
        <span>
          <Link href='/deckbuilder'>Deck Builder</Link>
        </span>
        <span>Tools</span>
        <span>Finance</span>
      </div>
      <img src='/images/edhcenter-text-logo-small.png' alt='EDHCENTER' />
      <div className='nav-items'>
        <span>Browse Decks</span>
        <span>Play Game</span>
        {!loading && isAuthenticated ? (
          <span>
            <Link href={`/profile/${user.data._id}`}>{user.data.username}</Link>
          </span>
        ) : (
          <span>
            <Link href='/login'>Log In</Link>
          </span>
        )}
      </div>
    </div>
  )
}

MainTopBar.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(MainTopBar)
