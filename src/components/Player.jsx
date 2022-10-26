import { useEffect, useRef, useState } from 'react'
import songs from '../data/songs'

function Player() {
  const [currentSong, setCurrentSong] = useState(0)
  const [audio, setAudio] = useState(songs[0])
  const audioPlayer = useRef(null)
  const btnPlayIcon = useRef(null)
  const btnRepeatIcon = useRef(null)
  const playerVolume = useRef(null)

  useEffect(() => {
    updatePlayer()
  }, [currentSong])

  const togglePlaySong = () => {
    if (audioPlayer.current.paused) {
      audioPlayer.current.play()
      btnPlayIcon.current.classList.replace(
        'bi-play-fill',
        'bi-pause-fill'
      )
    } else {
      audioPlayer.current.pause()
      btnPlayIcon.current.classList.replace(
        'bi-pause-fill',
        'bi-play-fill'
      )
    }
  }

  const changeSong = (next = true) => {
    if (next && currentSong < songs.length - 1) {
      setCurrentSong((currentSong) => currentSong + 1)
    } else if (!next && currentSong > 0) {
      setCurrentSong((currentSong) => currentSong - 1)
    } else {
      return
    }

    togglePlaySong()
  }

  const updatePlayer = () => {
    const song = songs[currentSong]
    setAudio(song)
  }

  const toggleRepeatSong = () => {
    btnRepeatIcon.current.classList.toggle('btn-activated')
  }

  const changeVolume = () => {
    const { value } = playerVolume.current
    audioPlayer.current.volume = value
  }

  return (
    <main className='container'>
      <div className='player'>
        <audio ref={audioPlayer} src={audio.path}></audio>
        <p className='song-status'>Now Playing</p>
        <img
          alt='cover song'
          className='song-cover'
          src={audio.imageSrc}
        />
        <h2 className='song-name'>{audio.name}</h2>
        <p className='song-author'>{audio.author}</p>

        <div className='player-progress'>
          <div className='progress-values'>
            <span>--:--</span>
            <span>--:--</span>
          </div>
          <input
            type='range'
            name=''
            id='player-progress'
            defaultValue={50}
          />
        </div>

        <div className='player-buttons'>
          <button
            className='btn btn-repeat'
            ref={btnRepeatIcon}
            onClick={toggleRepeatSong}
          >
            <i className='bi bi-repeat'></i>
          </button>
          <button
            className='btn btn-prev'
            onClick={() => changeSong(false)}
          >
            <i className='bi bi-rewind-fill'></i>
          </button>
          <button className='btn btn-play' onClick={togglePlaySong}>
            <i className='bi bi-play-fill' ref={btnPlayIcon}></i>
          </button>
          <button className='btn btn-next' onClick={changeSong}>
            <i className='bi bi-fast-forward-fill'></i>
          </button>

          <div className='dropdown'>
            <button id='btn-volume' className='btn btn-volume'>
              <i className='bi bi-volume-up-fill'></i>
            </button>

            <div className='dropdown-content'>
              <input
                onChange={changeVolume}
                type='range'
                id='player-volume'
                ref={playerVolume}
                defaultValue={1}
                min={0}
                max={1}
                step={0.01}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Player
