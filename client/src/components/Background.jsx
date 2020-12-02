import React from 'react'

export default function Background() {
    return (
        <div className='bg-svg'>
          <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
            <path fill='#ddd' d='M 1250 900 Q 1100 1050 1400 1250 Q 950 1500 850 1250 Q 350 900 700 1700 C 300 1350 350 900 150 1000 C 200 800 50 950 50 300 A 50 50 0 1 1 1500 450 Z ' />
            <path fill='#39393a' d='M 250 1650 Q 650 900 100 1700 Q 250 450 600 2000 Q 500 450 1100 1150 C 800 100 700 0 1100 0 C 1150 150 1500 700 1400 1000 A 50 50 0 1 1 250 1250 ' />
          </svg>
        </div>
    )
}
