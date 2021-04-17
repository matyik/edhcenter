import React from 'react'
import axios from 'axios'

const Modal = async () => {
  let fileReader

  const handleFileRead = () => {
    let deckText = fileReader.result
    const cmd = deckText
      .substring(deckText.indexOf('// Commander') + 15, deckText.length)
      .split('\n1 ')
    deckText = deckText.replace('\n\n// Commander', '')
    cmd.forEach((item) => {
      deckText = deckText.replace(`\n1 ${item}`, '')
    })

    // Basics
    let basicLands = [0, 0, 0, 0, 0, 0]
    basicsList.forEach((item, index) => {
      const searchedText = deckText.indexOf(item)
      if (searchedText !== -1) {
        if (deckText.charAt(searchedText - 2) === 'd') {
          if (deckText.charAt(searchedText - 16) === '\n') {
            basicLands[index] = parseInt(deckText.charAt(searchedText - 15))
            deckText = deckText.replace(
              deckText.substring(
                searchedText - 16,
                searchedText + basicsList[index].length
              ),
              ''
            )
          } else {
            basicLands[index] = parseInt(
              deckText.substring(searchedText - 16, searchedText - 14)
            )
            deckText = deckText.replace(
              deckText.substring(
                searchedText - 17,
                searchedText + basicsList[index].length
              ),
              ''
            )
          }
        } else {
          if (deckText.charAt(searchedText - 3) === '\n') {
            basicLands[index] = parseInt(deckText.charAt(searchedText - 2))
            deckText = deckText.replace(
              deckText.substring(
                searchedText - 3,
                searchedText + basicsList[index].length
              ),
              ''
            )
          } else if (deckText.charAt(searchedText - 4) === '\n') {
            basicLands[index] = parseInt(
              deckText.substring(searchedText - 3, searchedText - 2)
            )
            deckText = deckText.replace(
              deckText.substring(
                searchedText - 4,
                searchedText + basicsList[index].length
              ),
              ''
            )
          }
        }
        lands.current += basicLands[index]
      }
    })

    // Deck
    const cards = deckText.split('\r\n1 ')
    cards[0] = cards[0].replace('1 ', '')

    // Send POST request
    const req = await axios.post('http://localhost:5000/api/decks', { name: 'BRUH', deckArray: cards, commander: cmd, basics: basicLands, private: true })
  }

  const handleFileChosen = (file) => {
    fileReader = new FileReader()
    fileReader.onloadend = handleFileRead
    fileReader.readAsText(file)
  }

  return (
    <>
      <div className='modal-shade'></div>
      <div className='modal-main'>
        <div className='modal-title'>Game Options</div>
        <div className='modal-content'>
          <input
            className='ec-button'
            type='file'
            name='deck-file'
            onChange={(e) => handleFileChosen(e.target.files[0])}
            id='deckFile'
            accept='.txt, .dek'
          />
          or
          <div
            className='ec-button'
            onClick={() => {
              document.location = 'http://localhost:3000/deckbuilder'
            }}>
            Deck Maker
          </div>
        </div>
        <div className='modal-bottom'>
          <div
            className='ec-button ec-button-gray'
            onClick={() =>
              setVisibilities({ ...visibilities, gameModal: true })
            }>
            Close
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
