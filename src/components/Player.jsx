import { useEffect, useRef, useState } from 'react'
import songs from '../data/songs'

function Player() {
  const [currentSong, setCurrentSong] = useState(0)
  const [audio, setAudio] = useState(songs[0])
  const [repeatSong, setRepeatSong] = useState(false)
  const [timeSong, setTimeSong] = useState({
    currentTime: '00:00',
    duration: 0,
  })

  const audioPlayer = useRef(null)
  const playerProgress = useRef(null)
  const playerVolume = useRef(null)
  const btnPlayIcon = useRef(null)
  const btnRepeatIcon = useRef(null)

  useEffect(() => {
    updatePlayer()
  }, [currentSong])

  const togglePlaySong = () => {
    if (audioPlayer.current.paused) {
      btnPlayIcon.current.classList.replace(
        'bi-play-fill',
        'bi-pause-fill'
      )
      audioPlayer.current.play()
    } else {
      btnPlayIcon.current.classList.replace(
        'bi-pause-fill',
        'bi-play-fill'
      )
      audioPlayer.current.pause()
    }
  }

  const changeSong = (next = true) => {
    if (next && currentSong < songs.length - 1) {
      setCurrentSong(() => currentSong + 1)
    } else if (!next && currentSong > 0) {
      setCurrentSong(() => currentSong - 1)
    }
  }

  const updatePlayer = () => {
    audioPlayer.current.volume = 0.1

    const song = songs[currentSong]
    setAudio(song)
  }

  const changeVolume = () => {
    const { value } = playerVolume.current
    audioPlayer.current.volume = value
  }

  const timeUpdate = () => {
    const { currentTime, duration } = audioPlayer.current

    if (isNaN(duration)) return

    playerProgress.current.max = duration
    playerProgress.current.value = currentTime

    setTimeSong({
      currentTime: formatSecondsToMinutes(
        audioPlayer.current.currentTime
      ),
      duration: formatSecondsToMinutes(audioPlayer.current.duration),
    })
  }

  const formatSecondsToMinutes = (seconds = 0.0) => {
    return new Date(seconds * 1000).toISOString().slice(14, 19)
  }

  const changeTime = () => {
    audioPlayer.current.currentTime = playerProgress.current.value
  }

  const toggleRepeatSong = () => {
    setRepeatSong(!repeatSong)
    btnRepeatIcon.current.classList.toggle('btn-activated')
  }

  const ended = () => {
    repeatSong ? togglePlaySong() : changeSong(true)
  }

  return (
    <main className='container'>
      <div className='player'>
        <audio
          ref={audioPlayer}
          src={audio.path}
          onTimeUpdate={timeUpdate}
          onEnded={ended}
          onCanPlay={() => audioPlayer.current.play()}
        />

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
            <span>{timeSong.currentTime}</span>
            <span>
              {formatSecondsToMinutes(audioPlayer.current?.duration)}
            </span>
          </div>
          <input
            ref={playerProgress}
            type='range'
            defaultValue={0}
            onChange={changeTime}
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
            <button className='btn btn-volume'>
              <i className='bi bi-volume-up-fill'></i>
            </button>

            <div className='dropdown-content'>
              <input
                onChange={changeVolume}
                type='range'
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
