import React, { useState, useEffect, useRef } from 'react'
import qs from 'qs'
import io from 'socket.io-client'
import Background from '../Background'
import '../../play.css'

const { username, game } = (qs.parse(document.location.search, {
    ignoreQueryPrefix: true
}))

export default function Play() {

    const basicsList = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes']

    const [chat, setChat] = useState([])

    const firstRender = useRef(true)
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
    const socketRef = useRef(io.connect('/'))

    useEffect(() => {
        // socketRef.current = io.connect('/')
        socketRef.current.on('message', ({ username, message }) => {
            console.log(message)
            setChat([...chat, { username, message }])
            // console.log({ username, message })
            // chatBarRef.scrollTop = chatBarRef.scrollHeight
        })
    })

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

    const drawCard = (ammount) => {
        let msgText
        (ammount === 1) ? msgText = 'a card' : msgText = `${ammount} cards`
        msgText = `${username} has drawn ${msgText}`
        socketRef.current.emit('gameEvent', msgText)
        let drawn = []
        for (let i = 0; i < ammount; i++) {
            drawn.push(playerFields.current[0].library[0])
            playerFields.current[0].library.splice(0, 1)
        }
        playerFields.current[0].hand += drawn
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

    firstRender.current && setUpDeck(); firstRender.current = false

    return (
        <div className='play-container'>
            <Background />
            <div id='topBar'>
                <div id="gameName">{game}</div>
                <div id="usersCont">{username}</div>
            </div>
            <div className="battlefield" id="opponentField">
                <div id='opponentLands' className="bfCol"></div>
                <div id='opponentNonlands' className="bfCol"></div>
            </div>
            <div className="battlefield" id="playerField">
                <div id='playerNonlands' className="bfCol"></div>
                <div id='playerLands' className="bfCol"></div>
            </div>
            <div ref={chatBarRef} id='chatBar'>
                {chat.map(({ username, message}, index) => (
                    <div key={index} className='chat-message'>
                        <p className='meta'>{username}</p>
                        <p className='text'>{message}</p>
                    </div>
                ))}
            </div>
            <form id="input-msg" onSubmit={submitMsg}>
                <input id='msg' type='text' placeholder='Message' />
                <button id='send-button'>Send</button>
            </form>
            <div id='bottomBar'>
                <div id='graveyardArea'></div>
                <div id='handArea'></div>
                <div id='libraryArea'></div>
            </div>
            <div id="contextMenu">
                <div className="context-menu-item">Hand</div>
                <div className="context-menu-item">Graveyard</div>
                <div className="context-menu-item">Exile</div>
                <div className="context-menu-item">Library</div>
                <div className="context-menu-item">Command Zone</div>
            </div>
        </div>
    )
}