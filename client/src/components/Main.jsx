import React, { useState, useEffect, useRef } from 'react'
import { Pie } from 'react-chartjs-2'
import { useTransition, animated } from 'react-spring'

export default function Main() {

    const basicsList = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes']
    const manaSymbolsList = ['P', 'W', 'U', 'B', 'R', 'G', 'C', 'X']
    const [fileData, setFileData] = useState({ selectedFile: null })
    const [deck, setDeck] = useState({
        deckArray: [],
        commander: [],
        basics: []
    })
    const [cardInfo, setCardInfo] = useState()
    const [stats, setStats] = useState({
        avgCMC: 0,
    })
    const [types, setTypes] = useState({
        artifact: {
            name: 'Artifacts',
            url: require('../images/artifact.png'),
            status: true
        },
        creature: {
            name: 'Creatures',
            url: require('../images/creature.png'),
            status: true
        },
        enchantment: {
            name: 'Enchantments',
            url: require('../images/enchantment.png'),
            status: true
        },
        instant: {
            name: 'Instants',
            url: require('../images/instant.png'),
            status: true
        },
        land: {
            name: 'Lands',
            url: require('../images/land.png'),
            status: true
        },
        sorcery: {
            name: 'Sorcery',
            url: require('../images/sorcery.png'),
            status: true
        }// ,
        // {
        //     name: 'Planeswalker',
        //     url: 'bruh',
        //     status: true
        // }
    })
    const [loading, setLoading] = useState([])
    const [cardTypes, setCardTypes] = useState()
    const savedDeck = useRef(false)
    const totalCMC = useRef(0)
    const [prevIMG, setPrevIMG] = useState('')
    const [visibilities, setVisibilities] = useState({
        previewCardOnHover: true,
        showStatsButton: true,
        statsText: true,
        featuredDecks: false,
        gameModal: true,
        gameButton: true,
        deckFilters: true,
        loadingBar: true,
        cardModal: true
    })
    const [urls, setUrls] = useState([])
    let cmcMods = useRef({
        cmd: false,
        phyrexian: false,
        lands: false
    })
    const gameForm = useRef()
    const lands = useRef(0);
    const manaSymbols = useRef( [0, 0, 0, 0, 0, 0, 0, 0] )
    const manaSymbolOffsets = useRef({
        commander: [0, 0, 0, 0, 0, 0, 0],
        phyrexian: [0, 0, 0, 0, 0, 0, 0]
    })
    const [chartData, setChartData] = useState([0, 0, 0, 0, 0, 0, 0, 0])

    const transitions = useTransition(visibilities.gameModal, null, {
        from: { position: 'fixed', opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })
    const cardModalTransition = useTransition(visibilities.cardModal, null, {
        from: { position: 'fixed', opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })
    
    // On file select (from the pop up) 
    const fileUploadHandler = event => { 
        // Update the state 
        setFileData({ selectedFile: event.target.files[0] })
    }

    const arrayDeck = (deckText) => {
        setVisibilities({ ...visibilities,
            previewCardOnHover: false,
            featuredDecks: true,
            gameButton: false,
            deckFilters: false,
            loadingBar: false
        })

        // Commander
        const cmd = (deckText.substring(deckText.indexOf('// Commander') + 15, deckText.length)).split('\n1 ')
        deckText = deckText.replace('\n\n// Commander', '')
        cmd.forEach(item => {
            deckText = deckText.replace(`\n1 ${item}`, '')
        })

        // Basics
        let basicLands = [0, 0, 0, 0, 0, 0]
        basicsList.forEach((item, index) => {
            const searchedText = deckText.indexOf(item)
            if (searchedText !== -1) {
                if (deckText.charAt(searchedText-2) === 'd') {
					if (deckText.charAt(searchedText-16) === '\n') {
						basicLands[index] = parseInt(deckText.charAt(searchedText-15))
						deckText = deckText.replace(deckText.substring(searchedText-16, searchedText+basicsList[index].length), '')
					} else {
						basicLands[index] = parseInt(deckText.substring(searchedText-16, searchedText-14))
						deckText = deckText.replace(deckText.substring(searchedText-17, searchedText+basicsList[index].length), '')
					}
				} else {
					if (deckText.charAt(searchedText-3) === '\n') {
						basicLands[index] = parseInt(deckText.charAt(searchedText-2))
						deckText = deckText.replace(deckText.substring(searchedText-3, searchedText+basicsList[index].length), '')
					} else if (deckText.charAt(searchedText-4) === '\n') {
						basicLands[index] = parseInt(deckText.substring(searchedText-3, searchedText-2))
						deckText = deckText.replace(deckText.substring(searchedText-4, searchedText+basicsList[index].length), '')
					}
                }
                lands.current += basicLands[index]
            }
        })

        // Deck
        const cards = deckText.split('\r\n1 ')
        cards[0] = cards[0].replace('1 ', '')

        // Set state
        setDeck({ deckArray: cards, commander: cmd, basics: basicLands })
    }

    const getCommanderInfo = () => {
        deck.commander.forEach(item => {
            fetch('https://api.scryfall.com/cards/named?fuzzy=' + item)
            .then(res => res.json())
            .then(json => {
                let manaCost = json.mana_cost
                manaSymbolsList.forEach((item1, index) => {
                    let keepChecking = true
                    while (keepChecking) {
                        if (manaCost.indexOf(item1) !== -1) {
                            manaSymbolOffsets.current.commander[index+1]++
                            manaCost = manaCost.replace(item1, '')
                        } else {
                            keepChecking = false
                        }
                    }
                })
            })
        })
    }

    // let loadRender
    // const intervalling = useRef(false)
    const calculateStats = () => {
        let typesToSet = new Map()
        deck.deckArray.forEach( async (item) => {
            const res = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + item)
            const json = await res.json()
            let loadedCards = loading
            loadedCards.push(item)
            // if (!intervalling.current) {
            //     intervalling.current = true
            //     loadRender = setInterval(() => {setLoading(loadedCards);console.log(`loaded ${loading.length}`)}, 1000)
            // }
            setLoading(loadedCards)

            const typesLine = json.type_line
            typesToSet.set(item, typesLine)

            typesLine.indexOf('Land') !== -1 && lands.current++

            //mana symbols
            let manaCost = json.mana_cost

            manaSymbolsList.forEach((item1, index) => {
                let keepChecking = true
                while (keepChecking) {
                    if (manaCost.search(item1) !== -1) {
                        manaSymbols.current[index]++
                        if (index === 0) {
                            let phyrexianOG = manaCost.charAt(manaCost.search('P')-2)
                            for (let b = 1;b < 7;b++) {
                                if (phyrexianOG === basicsList[b]) {
                                    manaSymbolOffsets.phyrexian[b-1]--
                                }
                            }
                        }
                        manaCost = manaCost.replace(item1, '')
                    } else {
                        keepChecking = false
                    }
                }
            })

            totalCMC.current += json.cmc
        })
        setCardTypes(typesToSet)
        getCommanderInfo()
        // setStats({ avgCMC: totalCMC/100 })
    }

    const firstLoad = useRef(true)
    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false
            return
        } else {
            if (loading.length === deck.deckArray.length) {
                // clearInterval(loadRender)
                setVisibilities({ ...visibilities,
                    statsText: true,
                    deckFilters: false,
                    loadingBar: true
                })
                showStats()
            }
        }
        // eslint-disable-next-line
    }, [loading.length, loading])

    const makeDeck = (deckFile) => {
        const reader = new FileReader()
        reader.onload = function fileReadCompleted() {
            arrayDeck(reader.result)
        }
        reader.readAsText(deckFile)
    }

    const firstUpdate = useRef(true)
    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false
            return
        }

        makeDeck(fileData.selectedFile)
        // eslint-disable-next-line
    }, [fileData.selectedFile])

    const setCommanderImage = () => {
        deck.commander.forEach((item) => {
            fetch("https://api.scryfall.com/cards/named?fuzzy=" + item)
            .then(res => res.json())
            .then(json => {
                    setUrls(prevUrls => {return [...prevUrls, json.image_uris.normal]})
            })
        })
    }

    const firstDeckUpdate = useRef(true)
    useEffect(() => {
        if (firstDeckUpdate.current) {
            firstDeckUpdate.current = false;
            return
        }

        calculateStats()
        setCommanderImage()
        // eslint-disable-next-line
    }, [deck])

    const previewCard = (cardName) => {
        fetch("https://api.scryfall.com/cards/named?fuzzy=" + cardName)
	    .then(res => res.json())
	    .then(json => {
            setPrevIMG(json.image_uris.normal)
        })
    }

    const showStats = () => {
        redoStats()
        setVisibilities({ ...visibilities, showStatsButton: true, statsText: false })
    }

    // eslint-disable-next-line
    const pasteHandler = (event) => {
        setTimeout(() =>  {
            console.log(event.target.value)
            // arrayDeck(e.value)
        }, 1)
    }

    const saveDeck = () => {
        let deckToPush = [...deck.deckArray]
        deckToPush.forEach((element, index) => {
            deckToPush[index] = element.replace(',', '#')
        })
        let commanderToPush = [...deck.commander]
        commanderToPush.forEach((element, index) => {
            commanderToPush[index] = element.replace(',', '#')
        })
        localStorage.setItem('edhcenter_deck', deckToPush)
        localStorage.setItem('edhcenter_cmd', commanderToPush)
        localStorage.setItem('edhcenter_basics', deck.basics)
        savedDeck.current = true
    }

    const firstStat = useRef(true)
    // const firstPhy = useRef(true)
    const redoStats = () => {
        !savedDeck.current && saveDeck()
        let divisor
        let currentManaSymbols = [0, 0, 0, 0, 0, 0]
        cmcMods.current.lands ? divisor = 100 : divisor = 100 - lands.current
        if (cmcMods.current.cmd) {
            divisor += deck.commander.length
            manaSymbolOffsets.current.commander.forEach((item, index) => {
                currentManaSymbols[index-2] = manaSymbols.current[index-2] + item
            })
        } else {
            currentManaSymbols = manaSymbols.current
            firstStat.current && currentManaSymbols.shift(); firstStat.current = false
        }
        let dividend = totalCMC.current
        // if (cmcMods.current.phyrexian) {
        //     dividend -= manaSymbols.current[0]
        //     manaSymbolOffsets.current.phyrexian.forEach((item, index) => {
        //         currentManaSymbols[index-2] = manaSymbols.current[index-2] - item
        //     })
        // } else {
        //     currentManaSymbols = manaSymbols.current
        //     firstPhy.current && currentManaSymbols.shift(); firstPhy.current = false
        // }
        cmcMods.current.cmd && (divisor += 7)
        setStats({ avgCMC: Math.round(dividend / divisor * 1000) / 1000 })
        const chartState = currentManaSymbols
        setChartData(chartState)
    }

    const showGameMenu = () => {
        !savedDeck.current && saveDeck()
        setVisibilities({ ...visibilities, gameModal: false })
    }

    const loadCardModalData = async (cardName) => {
        const res = await fetch('https://api.scryfall.com/cards/named?fuzzy=' + cardName)
        const json = await res.json()
        let isReserved
        json.reserved ? isReserved = 'Yes' : isReserved = 'No'
        const cardLegality = json.legalities.commander.charAt(0).toUpperCase() + json.legalities.commander.slice(1)
        setCardInfo({
            price: `$${json.prices.usd}`,
            legality: cardLegality,
            set: json.set_name,
            rank: json.edhrec_rank,
            reserved: isReserved,
            url: json.image_uris.normal,
            name: cardName
        })
        setVisibilities({ ...visibilities, cardModal: false })
    }

    return (
        <div className='mainwrap'>
            <div className='topbar'>
                <div className='stuff-to-hide'  hidden={visibilities.featuredDecks}>
                    <div className='title-text'>Import a deck:</div>
                    <textarea className='paste-deck' placeholder='Paste a deck here'></textarea>
                    <div className='orTxt'>OR</div>
                    <input className='ec-button' onChange={fileUploadHandler} type='file' accept='.txt, .dek' />
                    <div className='featured-decks-bar'></div>
                </div>
                <button hidden={visibilities.gameButton} className='ec-button' onClick={showGameMenu}>Play Game</button>
                <div className='stats-container' hidden={visibilities.statsText}>
                    <div className='text-stats'><span>{`Average CMC: ${stats.avgCMC}`}</span></div>
                    <div className='cmc-settings'>
                        <input type='checkbox' className='check-stats' onChange={(e) => {cmcMods.current.cmd = e.target.checked; redoStats()}}  /><label>Include Commander</label><br />
                        <input type='checkbox' className='check-stats' onChange={(e) => {cmcMods.current.phyrexian = e.target.checked; redoStats()}} /><label>Count Phyrexian Mana as 0</label><br />
                        <input type='checkbox' className='check-stats' onChange={(e) => {cmcMods.current.lands = e.target.checked; redoStats()}} /><label>Include Lands in CMC</label>
                    </div>
                    <div className='chart-container'>
                        <Pie
                            data={{
                                datasets: [{
                                    data: chartData,
                                    backgroundColor: [
                                        '#EDDE79',
                                        '#286BA3',
                                        '#150B00',
                                        '#D3202A',
                                        '#158A00',
                                        '#B0B0B0'
                                    ]
                                }],
                                labels: [
                                    'White',
                                    'Blue',
                                    'Black',
                                    'Red',
                                    'Green',
                                    'Colorless'
                                ]
                            }}
                        />
                    </div>
                </div>
                <div className='filter-grid' hidden={visibilities.deckFilters}>
                    {/* eslint-disable-next-line */}
                    {Object.keys(types).map((key, index) => {
                        let fclass
                        !types[key].status ? fclass = 'filter-item filter-gray' : fclass = 'filter-item'
                        return (<div title={types[key].name} key={`fi${index}`} className={fclass} onClick={() => {
                            let typeHolder = {...types}
                            typeHolder[key].status = !types[key].status
                            setTypes(typeHolder)}}>
                            <img src={types[key].url} alt={types[key].name} />
                        </div>)
                    })}
                </div>
                <div className='preview-on-hover' hidden={visibilities.previewCardOnHover}>
                    <img alt='Hover over a card to view' width='200' className='image-previewer' src={prevIMG} />
                </div>
            </div>
            <div className='loading-bar' hidden={visibilities.loadingBar}>
                <div className="loaded" style={{width: `${(loading.length/deck.deckArray.length)*100}%`}}></div>
            </div>
            <div className='commanders'>
                {deck.commander.map((item, index) => {
                    return <img key={`im${index}`} className='commander' src={urls[index]} alt={`commander ${item}`} onMouseEnter={() => previewCard(item)} />
                })}
            </div>
            <div className='deck-container'>
                {/* eslint-disable-next-line */}
                {deck.deckArray.map((item, index) => {
                    let dontRender = false
                    
                    Object.keys(types).forEach(key => {
                        (!types[key].status && (cardTypes.get(item).indexOf(types[key].name.slice(0, -1)) !== -1)) && (dontRender = true)
                    })

                    if (!dontRender) return <div key={index} onMouseEnter={() => previewCard(item)} onClick={() => loadCardModalData(item)} className='card'>{item}</div>
                })/* eslint-disable-next-line */}
                {(types.land.status) && deck.basics.map((item, index) => {
                    const basicsList = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes']
                    if (item !== 0) {
                        return <div key={`pr${index}`} onMouseEnter={() => previewCard(basicsList[index])} onClick={() => loadCardModalData(basicsList[index])} className='card'>{`${item} ${basicsList[index]}`}</div>
                    }
                })}
            </div>
            {transitions.map(({ item, key, props }) =>
                !item &&
                    <React.Fragment key={key}>
                        <div className='modal-shade' hidden={visibilities.gameModal} onClick={() => setVisibilities({ ...visibilities, gameModal: true })}></div>
                        <animated.div style={props} className='modal-main'>
                            <div className='modal-title'>Game Options</div>
                            <div className='modal-content'>
                                <form ref={gameForm} className='gameForm' action='/play'>
                                    <input name='game' type='text' placeholder='Game ID'></input>
                                    <input name='username' type='text' placeholder='Nickname'></input>
                                </form>
                            </div>
                            <div className='modal-bottom'>
                                <div className='ec-button' onClick={() => gameForm.current.submit()}>Join Game</div>
                                <div className='ec-button ec-button-gray' onClick={() => setVisibilities({ ...visibilities, gameModal: true })}>Close</div>
                            </div>
                        </animated.div>
                    </React.Fragment>
                )
            }
            {cardModalTransition.map(({ item, key, props }) =>
                !item &&
                    <React.Fragment key={`cm${key}`}>
                        <div className='modal-shade' hidden={visibilities.cardModal} onClick={() => setVisibilities({ ...visibilities, cardModal: true })}></div>
                        <animated.div style={props} className='modal-main modal-main-card'>
                            <div className='modal-title'>Card Info</div>
                            <div className='modal-content'>
                                <div className="left-spread">
                                    <span className='left'>Price:</span>
                                    <span>{cardInfo.price}</span>
                                    <span className='left'>Legality:</span>
                                    <span>{cardInfo.legality}</span>
                                    <span className='left'>Set:</span>
                                    <span>{cardInfo.set}</span>
                                    <span className='left'>Edhrec Rank:</span>
                                    <span>{cardInfo.rank}</span>
                                    <span className='left'>Reserved:</span>
                                    <span>{cardInfo.reserved}</span>
                                </div>
                                <img src={cardInfo.url} alt={cardInfo.name} className="cardimg"/>
                            </div>
                            <div className='modal-bottom'>
                                <div className='ec-button ec-button-gray' onClick={() => setVisibilities({ ...visibilities, cardModal: true })}>Close</div>
                            </div>
                        </animated.div>
                    </React.Fragment>
                )
            }
        </div>
    )
    
}