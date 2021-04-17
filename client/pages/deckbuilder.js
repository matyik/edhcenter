import React, { useState, useRef } from 'react'
import MainTopBar from '../components/MainTopBar'

const DeckBuilder = () => {
  const [autofillItems, setAutofillItems] = useState([])
  const [currentDeck, setCurrentDeck] = useState([])
  const [showMenu, setShowMenu] = useState('')

  const cardInput = useRef()
  const cardQty = useRef()

  const changedCard = async (e) => {
    const autofillText = e.target.value
    if (autofillText === '') {
      setAutofillItems([])
    } else {
      const res = await fetch(
        `https://api.scryfall.com/cards/autocomplete?q=${autofillText}`
      )
      const json = await res.json()
      setAutofillItems(json.data.slice(0, 9))
    }
  }

  const addCard = (cardName, quantity) => {
    if (quantity === undefined) setCurrentDeck([...currentDeck, [cardName, 1]])
    else setCurrentDeck([...currentDeck, [cardName, quantity]])
    cardInput.current.value = ''
    cardQty.current.value = ''
    setAutofillItems([])
  }

  const addQty = (cardName, index, amount) => {
    let deckToPush = [
      ...currentDeck,
      [cardName, Number(currentDeck[index][1]) + amount]
    ]
    deckToPush[deckToPush.length - 1] <= 0 &&
      deckToPush.splice(deckToPush.length - 1)
    deckToPush.splice(index, 1)
    setCurrentDeck(deckToPush)
  }

  return (
    <>
      <MainTopBar />
      <div className='deck-maker-container'>
        <div className='maker-section'>
          <h2>Deck Info</h2>
          <hr />
          <div className='input'>
            <input name='deck-name' className='input__input' placeholder=' ' />
            <label className='input__label'>Deck Name</label>
          </div>
        </div>
        <div className='maker-section'>
          <h2>Cards</h2>
          <hr />
          <div className='deck-split'>
            <div>
              <div className='add-card-flex'>
                <div className='input'>
                  <input
                    ref={cardInput}
                    onChange={(e) => changedCard(e)}
                    name='card-name'
                    className='input__input'
                    placeholder=' '
                    autoComplete='off'
                  />
                  <label className='input__label'>Add a card</label>
                </div>
                <div className='qty-dropdown-cont'>
                  QTY{' '}
                  <input
                    ref={cardQty}
                    type='number'
                    min='1'
                    max='100'
                    name='quantity'
                    id='qty'
                    className='qty-dropdown'
                  />
                </div>
                <div
                  className='ec-button'
                  onClick={() =>
                    addCard(cardInput.current.value, cardQty.current.value)
                  }>
                  Add Card
                </div>
              </div>
              <div className='card-autofill'>
                {autofillItems.map((item, index) => {
                  return (
                    <div
                      key={`ai${index}`}
                      className='autofill-item'
                      onClick={() => addCard(item, cardQty.current.value)}>
                      {item}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='deck-visualizer'>
              {currentDeck.map((card, index) => {
                return (
                  <div
                    key={`cd${index}`}
                    className='card'
                    onMouseEnter={() => setShowMenu(card[0])}
                    onMouseLeave={() => setShowMenu('')}>
                    {`${card[1]} ${card[0]}`}
                    {showMenu === card[0] && (
                      <div className='card-menu'>
                        <div
                          className='menu-option green'
                          onClick={() => addQty(card[0], index, 1)}>
                          +1
                        </div>
                        <div
                          className='menu-option red'
                          onClick={() => addQty(card[0], index, -1)}>
                          -1
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='maker-section'>
          <h2>Options</h2>
          <hr />
          <form action=''>
            <div className='optiongrid'>
              <label htmlFor='private'>Is Private</label>
              <input type='checkbox' name='private' id='private' />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default DeckBuilder
