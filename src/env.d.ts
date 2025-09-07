/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// 音频文件模块声明
declare module '*.mp3' {
  const src: string
  export default src
}

declare module '*.wav' {
  const src: string
  export default src
}

declare module '*.ogg' {
  const src: string
  export default src
}

// Web Audio API 类型声明
declare global {
  interface Window {
    AudioContext: typeof AudioContext
    webkitAudioContext: typeof AudioContext
  }
}
