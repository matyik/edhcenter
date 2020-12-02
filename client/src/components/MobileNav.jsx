import React from 'react'
import { useTransition } from 'react-spring'

export const MobileNav = ({ show }) => {

    const transitions = useTransition(show, null, {
        from: { position: 'absolute', opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })

    return (
        <React.Fragment>
            {transitions.map(({ item, key, props }) =>
                item &&
                    <div key={key} className="mobile-nav" style={props}>
                        <span>Deck Builder</span>
                        <span>Tools</span>
                        <span>Other Pages</span>
                        <span>Browse Decks</span>
                        <span>Play Game</span>
                        <span>Log In</span>
                    </div>
            )}
        </React.Fragment>
    )
}

export default MobileNav