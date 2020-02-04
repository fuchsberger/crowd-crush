import React from 'react'
import { Player } from '../components'

const Watch = ({ match }) => (
  <div className='video-wrapper'>
    <Player id={match.params.id} />
  </div>
)

export default Watch
