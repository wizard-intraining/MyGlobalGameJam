"use strict";
// 播放

const Hint = (() => {
  class _Hint {
    constructor(src, volume = 1) {
      this.src = src
      this.volume = volume
    }
    play() {
      if (this.audio === undefined) {
        // load
        console.log(`loading ${this.src}`)
        this.audio = document.createElement('audio')
        this.audio.src = this.src
        this.audio.volume = this.volume
        if (this.src.startsWith('./src/music/singal-music-notes/violin'))
          this.audio.volume = this.volume * 0.3
      }
      // play
      console.log(`play ${this.src}`)
      this.audio.currentTime = 0 // 解决有时播不出来的问题
      this.audio.play()
    }
  }
  const _hint = {
    NORMALBUMP: new _Hint('./src/music/hintMusic/normalbump.wav'),
    DOORBUMP: new _Hint('./src/music/hintMusic/doorbump.wav'),
    PAPER: new _Hint('./src/music/hintMusic/paper.wav'),
    PAPERWEAK: new _Hint('./src/music/hintMusic/paper.wav', 0.3),
    DOOROPEN: new _Hint('./src/music/hintMusic/dooropen.mp3'),
    VICTORY: new _Hint('./src/music/hintMusic/victory.wav'),
    WATERWAVE: new _Hint('./src/music/hintMusic/riverside.wav'),
    BOATMOVE: new _Hint('./src/music/hintMusic/boatmove.wav'),
    FIREBURN: new _Hint('./src/music/hintMusic/fireBurn.wav'),
    WATEROUT: new _Hint('./src/music/hintMusic/waterout.wav'),
  }
  _hint.instrumentList = ['piano', 'violin', 'guitar']
  for (const instrument of _hint.instrumentList) {
    _hint[instrument] = {}
    for (const note of [
      { prefix: 'low', from: 1, to: 7 },
      { prefix: 'mid', from: 1, to: 7 },
      { prefix: 'tall', from: 1, to: 1 }]) {
      for (let i = note.from; i <= note.to; i++) {
        _hint[instrument][`${note.prefix}${i}`] =
          new _Hint('./src/music/singal-music-notes/' +
            `${instrument}/${note.prefix}${i}.wav`)
      }
    }
  }
  return _hint
})()