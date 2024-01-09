

/**
 * 阅读option
 */
interface SpeechReadOption {
    rate: number // 语速 
    volume: number // 音量
    pitch: number // 语调
    lang: string // zh-CN en-US //格式
    EndFun: Function // 阅读结束回调函数
}

/**
 * 设置语调、音量、语速类型
 */
interface SetSpeechRateAndVolumeAndPitchOption {
    key: 'rate' | 'volume' | 'pitch'
    type: 'add' | 'less'
}




/**
 * 调用阅读
 */
class Speech {
    speech: SpeechSynthesisUtterance = null // 阅读对象
    EndFun: Function = null // 阅读结束回调函数
    constructor(option: SpeechReadOption) {
        console.log(option);
        this.speech = new SpeechSynthesisUtterance()
        this.speech.rate = option.rate
        this.speech.volume = option.volume
        this.speech.pitch = option.pitch
        this.speech.lang = option.lang
        this.EndFun = option.EndFun
        this.speech.onend = () => { // 阅读结束回调
            this.speechEnd()
        }
    }
    /**
     * 设置阅读内容
     */
    setText(text: string) {
        this.speech.text = text
    }
    /**
     * 开始阅读
     */
    speechStart() {
        window.speechSynthesis.speak(this.speech)
    }
    /**
     * 暂停阅读
     */
    speechPause() {
        window.speechSynthesis.pause()
    }
    /**
     * 恢复阅读
     */
    speechResume() {
        window.speechSynthesis.resume()
    }
    /**
     * 结束阅读
     */
    speechEnd() {
        this.EndFun()
    }
    /**
     * 设置阅读语调/音量/语速
     */
    setSpeechRateAndVolumeAndPitch(option: SetSpeechRateAndVolumeAndPitchOption) {
        if (option.type == 'add') {
            this.speech[option.key] += 0.01
        }
        if (option.type == 'less') {
            this.speech[option.key] -= 0.01
        }
        // 重新设置语音合成对象的属性
        window.speechSynthesis.cancel(); // 先取消之前的合成
        window.speechSynthesis.speak(this.speech);
    }


}



export default Speech


