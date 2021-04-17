import React, { useState, useEffect, useRef } from 'react'
import qs from 'qs'
import io from 'socket.io-client'
import { useTransition, animated } from 'react-spring'

const { username, game } = (qs.parse(document.location.search, {
    ignoreQueryPrefix: true
}))

const Play = () => {

    const contextMenuRef = useRef(null)

    const basicsList = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes']

    const [chat, setChat] = useState([])

    const chatBarRef = useRef()
    const playerFields = useRef(
        [
            {
                library: [],
                hand: [],
                graveyard: [],
                exile: [],
                commandZone: []
            }
        ]
    )

    const [visibilities, setVisibilities] = useState(
        {
            contextMenu: false
        }
    )

    const transitions = useTransition(visibilities.contextMenu, null, {
        from: { position: 'fixed', opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })

    const tappedCards = useRef([])
    const [battlefields, setBattlefields] = useState({})
    const socketRef = useRef(io.connect('/'))
    const [urlsMap, setUrlsMap] = useState(new Map())
    const [landsMap, setLandsMap] = useState(new Map())

    useEffect(() => {
        socketRef.current.on('message', ({ username, message }) => {
            setChat(prevchat => [...prevchat, { username, message }])
            chatBarRef.current.scrollTo(0, 100)
        })
    }, [])

    const submitMsg = e => {
        e.preventDefault()
        const message = e.target.msg.value
        e.target.msg.value = ''
        e.target.elements.msg.focus()
        socketRef.current.emit('message', { username, message })
    }

    const shuffleLibrary = () => {
        const msgText = `${username} has shuffled their library`
        socketRef.current.emit('gameEvent', msgText)
        let oldLib = [...playerFields.current[0].library]
        playerFields.current[0].library.forEach((item, index) => {
            const cardsLeft = playerFields.current[0].library.length - 1 - index
            const randCard = Math.floor(Math.random(0, cardsLeft) * cardsLeft)
            playerFields.current[0].library[index] = oldLib[randCard]
            oldLib.splice(randCard, 1)
        })
    }

    const drawCard = async (ammount) => {
        let msgText
        (ammount === 1) ? msgText = 'a card' : msgText = `${ammount} cards`
        msgText = `${username} has drawn ${msgText}`
        socketRef.current.emit('gameEvent', msgText)
        let drawn = []
        let uris = []
        for (let i = 0; i < ammount; i++) {
            const item = playerFields.current[0].library[0]
            const res = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + item)
            const json = await res.json()
            uris.push([item, json.image_uris.normal])

            drawn.push(item)
            playerFields.current[0].library.splice(0, 1)
        }
        playerFields.current[0].hand.push(...drawn)
        setUrlsMap(new Map([...urlsMap, ...uris]))
        console.log(playerFields.current[0].hand)
    }

    const setUpDeck = () => {
        let deck = localStorage.getItem('edhcenter_deck').split(',')
        const cmd = localStorage.getItem('edhcenter_cmd').split(',')
        const basics = localStorage.getItem('edhcenter_basics').split(',')

        deck.forEach((item, index) => {
            deck[index] = item.replace('#', ',')
        })
        basics.forEach((item, index) => {
            for (let i = 0; i < item; i++) {
                deck.push(basicsList[index])
            }
        })
        console.log(deck, cmd)
        playerFields.current[0].library = deck
        playerFields.current[0].commandZone = cmd
        shuffleLibrary()
        drawCard(7)
    }

    useEffect(() => {
        console.log(urlsMap)
    }, [urlsMap])

    const playCard = async item => {
        const cardName = item.target.alt
        socketRef.current.emit('gameEvent', `${username} has played ${cardName}`)
        playerFields.current[0].hand = playerFields.current[0].hand.filter(e => e !== cardName)
        const res = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`)
        const json = await res.json()
        let isLand
        (json.type_line.indexOf('Land') === -1) ? isLand = false : isLand = true
        setLandsMap(landsMap.set(cardName, isLand))
        let prevBattlefield = []
        battlefields[username] && (prevBattlefield = battlefields[username])
        setBattlefields({ ...battlefields, [username]: [...prevBattlefield, cardName]})
    }

    const tapCard = item => {
        const cardName = item.target.alt
        let cardClass
        let msgTxt
        if (tappedCards.current.indexOf(cardName) === -1) {
            cardClass = 'card tapped'
            msgTxt = `${username} has tapped ${cardName}`
            tappedCards.current.push(cardName)
        } else {
            cardClass = 'card'
            msgTxt = `${username} has untapped ${cardName}`
            tappedCards.current = tappedCards.current.filter(e => e !== cardName)
        }
        socketRef.current.emit('gameEvent', msgTxt)
        item.target.className = cardClass
    }

    const rightClicked = e => {
        setVisibilities({ ...visibilities, contextMenu: !visibilities.contextMenu })

        e !== 'clear' &&
            e.preventDefault()
            const x = e.target.clientX
            const y = e.target.clientY
            contextMenuRef.current.style.left = x
            contextMenuRef.current.style.top = y
    }

    return (
        <div className='play-container'>
            <div className='top-bar'>
                <div className="game-name">{game}</div>
                <div className="users-cont"><div className="user">{username}</div></div>
            </div>
            <div className="left-menu">
                <div className="option" onClick={setUpDeck}>Search Library</div>
                <div className="option">Shuffle Library</div>
                <div className="option">Insert Card/Token</div>
                <div className="option">Attack</div>
                <div className="option">Command Zone</div>
                <div className="option">Roll Die</div>
                <div className="option">Undo</div>
                <div className="option">Options</div>
            </div>
            <div className="battlefield opponent-field">
                <div className='opponent-lands bfCol'></div>
                <div className="bfCol opponent-nonlands"></div>
            </div>
            <div className="battlefield player-field">
                <div className="bfCol player-nonlands">{
                    battlefields[username] && battlefields[username].map((item, index) => {
                        if (!landsMap.get(item)) {
                            return <img onContextMenu={e => rightClicked(e)} onClick={item => tapCard(item)} className="card" alt={item} key={`bc${index}`} src={urlsMap.get(item)} />
                        } return ''
                    })
                }</div>
                <div className="bfCol player-lands">{
                    battlefields[username] && battlefields[username].map((item, index) => {
                        if (landsMap.get(item)) {
                            return <img onContextMenu={e => rightClicked(e)} onClick={item => tapCard(item)} className="card" alt={item} key={`bc${index}`} src={urlsMap.get(item)} />
                        } return ''
                    })
                }</div>
            </div>
            <div ref={chatBarRef} className='chat-bar'>
                {chat.map(({ username, message}, index) => (
                    <div key={index} className='chat-message'>
                        <p className='meta'>{username}</p>
                        <p className='text'>{message}</p>
                    </div>
                ))}
            </div>
            <form className="input-msg" autoComplete='off' onSubmit={submitMsg}>
                <input className='msg' id='msg' type='text' placeholder='Message' />
                <button className='send-button ec-button'>Send</button>
            </form>
            <div className='bottom-bar'>
                <div className='graveyard-area'></div>
                <div className='hand-area'>
                    {playerFields.current[0].hand.map( (item, index) => {
                        return <img onClick={item => playCard(item)} className="handcard" alt={item} key={`hc${index}`} src={urlsMap.get(item)} />
                    })}
                </div>
                <div className='library-area' onClick={() => drawCard(1)}>
                    <div className="shade">Click to draw a card</div>
                    <img className='card' src="https://c1.scryfall.com/file/scryfall-card-backs/png/0a/0aeebaf5-8c7d-4636-9e82-8c27447861f7.png" alt="Library"/>
                </div>
            </div>
            {transitions.map(({ item, key, props }) =>
                item &&
                <React.Fragment key={`contextmenu${key}`}>
                    <div className="contextmenu-backdrop" onClick={() => rightClicked('clear')} ></div>
                    <animated.div ref={contextMenuRef} style={props} className="context-menu">
                        <div className="context-menu-item">Hand</div>
                        <div className="context-menu-item">Graveyard</div>
                        <div className="context-menu-item">Exile</div>
                        <div className="context-menu-item">Library</div>
                        <div className="context-menu-item">Command Zone</div>
                    </animated.div>
                </React.Fragment>
            )}
        </div>
    )
}

export default Play