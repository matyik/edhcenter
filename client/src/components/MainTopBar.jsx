import React from 'react'
import edhcenterLogo from '../images/edhcenter-text-logo-small.png'

export default function MainTopBar({ clickTrigger }) {
    return (
        <div className='main-topbar'>
            <div className="nav-hamburger" onClick={clickTrigger}>
                <svg viewBox="0 0 100 80" width="40" height="40">
                    <rect stroke="fff" width="100" height="20"></rect>
                    <rect stroke="fff" y="30" width="100" height="20"></rect>
                    <rect stroke="fff" y="60" width="100" height="20"></rect>
                </svg>
            </div>
            <div className="nav-items">
                <span>Deck Builder</span>
                <span>Tools</span>
                <span>Finance</span>
            </div>
            <img src={edhcenterLogo} alt="EDHCENTER" />
            <div className="nav-items">
                <span>Browse Decks</span>
                <span>Play Game</span>
                <span>Login In</span>
            </div>
        </div>
    )
}
