import React, { useState } from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MainTopBar from '../../../components/MainTopBar'
import { logout } from '../../../actions/auth'
import FeaturedDeck from '../../../components/FeaturedDeck'
import Modal from '../../../components/Modal'

const profile = ({ auth: { logout, user }, resuser }) => {
  const [selectedTab, setSelectedTab] = useState('decks')
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <Head>
        <title>Profile - Edhcenter</title>
      </Head>
      <MainTopBar />
      <div className='top-profile-bar'>
        <div className='profile-left'>
          <h1>
            {resuser.data.username} {resuser.data.verified && <span>V</span>}
          </h1>
          <span className='rank'>{resuser.data.role}</span>
          <div className='profile-picture'></div>
        </div>
        <div className='line-vertical'></div>
        <p className='profile-bio'>{resuser.data.bio && resuser.data.bio}</p>
        {resuser.data._id === user.data._id && (
          <>
            <div className='line-vertical'></div>
            <div className='small-nav'>
              <div className='ec-button'>Settings</div>
              <div className='ec-button'>History</div>
              <div onClick={logout} className='ec-button'>
                Log Out
              </div>
            </div>
          </>
        )}
      </div>
      <div className='profile-content-tabs'>
        <div
          className={`profile-content-tab ${
            selectedTab === 'decks' && 'profile-content-tab-select'
          }`}
          onClick={() => setSelectedTab('decks')}>
          Decks
        </div>
        <div
          className={`profile-content-tab ${
            selectedTab === 'comments' && 'profile-content-tab-select'
          }`}
          onClick={() => setSelectedTab('comments')}>
          Comments
        </div>
      </div>
      {resuser.data._id === user.data._id && (
        <button
          className='ec-button'
          onClick={() => {
            setShowModal(!showModal)
          }}>
          Add a deck
        </button>
      )}
      <FeaturedDeck />
      {showModal && <Modal />}
    </>
  )
}

export const getServerSideProps = async (context) => {
  const res = await fetch(
    `http://localhost:5000/api/users/${context.params.id}`
  )
  const resuser = await res.json()

  return {
    props: { resuser }
  }
}

profile.propTypes = {
  logout: PropTypes.func.isRequired
  // auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(profile)
