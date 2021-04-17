import React from 'react'
import { useTransition, animated } from 'react-spring'

export const MobileNav = ({ showNav }) => {

    const topTransitions = useTransition(showNav.top, null, {
        from: { transform: 'translateY(-125%)' },
        enter: { transform: 'translateY(0)' },
        leave: { transform: 'translateY(-125%)' },
    })

    const midTransitions = useTransition(showNav.middle, null, {
        from: { transform: 'translateY(-125%)' },
        enter: { transform: 'translateY(0)' },
        leave: { transform: 'translateY(-125%)' },
    })

    const bottomTransitions = useTransition(showNav.bottom, null, {
        from: { transform: 'translateY(-125%)' },
        enter: { transform: 'translateY(0)' },
        leave: { transform: 'translateY(-125%)' },
    })

    return (
        <React.Fragment>
            {bottomTransitions.map(({ item, key, props }) =>
                item &&
                    <>
                        <animated.div className='mn-bg bg-2' style={props} key={`b${key}`}></animated.div>
                    </>
            )}
            {midTransitions.map(({ item, key, props }) =>
                item &&
                    <>
                        <animated.div className='mn-bg bg-1' style={props} key={`m${key}`}></animated.div>
                    </>
            )}
            {topTransitions.map(({ item, key, props }) =>
                item &&
                    <>
                        <animated.div key={`t${key}`} className="mn-bg mobile-nav" style={props}>
                            <span>Deck Builder</span>
                            <span>Tools</span>
                            <span>Other Pages</span>
                            <span>Browse Decks</span>
                            <span>Play Game</span>
                            <span>Log In</span>
                        </animated.div>
                    </>
            )}
        </React.Fragment>
    )
}

export default MobileNav