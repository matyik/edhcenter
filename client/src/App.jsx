import React, { useState } from 'react'
import Main from './components/Main.jsx'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Play from './components/pages/Play.jsx'
import Background from './components/Background.jsx'
import MainTopBar from './components/MainTopBar.jsx'
import MobileNav from './components/MobileNav.jsx'

function App() {

  const [showMobileNav, setShowMobileNav] = useState(false)

  return (
    <Router>
      <div className="App">
        <Route exact path='/' render={props => (
          <React.Fragment>
            <Background />
            <MainTopBar clickTrigger={() => setShowMobileNav(!showMobileNav)} />
            <MobileNav show={showMobileNav} />
            <Main />
            <footer className='foot'>Edhcenter.com is unofficial Fan Content permitted under the <a href='https://company.wizards.com/fancontentpolicy'>Fan Content Policy</a>. Not approved/endorsed by Wizards.
            Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.</footer>
          </React.Fragment>
        )} />
        <Route path='/play' component={Play} />
      </div>
    </Router>
  )
}

export default App