import React, { useState } from 'react'
import Main from './components/Main.jsx'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Play from './components/pages/Play.jsx'
import Background from './components/Background.jsx'
import MainTopBar from './components/MainTopBar.jsx'
import MobileNav from './components/MobileNav.jsx'

function App() {

  const [showMobileNav, setShowMobileNav] = useState({
    bottom: false,
    middle: false,
    top: false
  })

  const toggleMobileNav = () => {
    if (showMobileNav.top) {
      setShowMobileNav({ ...showMobileNav, top: false })
      setTimeout(() => setShowMobileNav({ ...showMobileNav, top: false, middle: false }), 250)
      setTimeout(() => setShowMobileNav({ ...showMobileNav, bottom: false, middle: false, top: false }), 500)
    } else {
      setShowMobileNav({ ...showMobileNav, bottom: true })
      setTimeout(() => setShowMobileNav({ ...showMobileNav, bottom: true, middle: true }), 250)
      setTimeout(() => setShowMobileNav({ ...showMobileNav, bottom: true, middle: true, top: true }), 500)
    }
  }

  return (
    <Router>
      <div className="App">
        <Route exact path='/' render={props => (
          <React.Fragment>
            <Background />
            <MainTopBar clickTrigger={toggleMobileNav} />
            <Main />
            <footer className='foot'>Edhcenter.com is unofficial Fan Content permitted under the <a href='https://company.wizards.com/fancontentpolicy'>Fan Content Policy</a>. Not approved/endorsed by Wizards.
            Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.</footer>
            <MobileNav showNav={showMobileNav} />
          </React.Fragment>
        )} />
        <Route path='/play' component={Play} />
      </div>
    </Router>
  )
}

export default App