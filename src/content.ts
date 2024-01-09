
import PlayWeb from './play/play'
const body = document.body
const option = {
    rate: 1,
    volume: 1,
    pitch: 0.2,
    lang: "zh-CN",
    EndFun: speechEnd
}
const speech = new PlayWeb(option)
// 阅读配置项

type ReadConfig = {
    listIndex: number,
    dissIndex: number, // 评论区索引
    dissMaxIndex: number, // 评论区长度
    mainOrDissStatus: MainOrDissStatus, // 状态
    readStatus: boolean // 阅读状态
}
/**
 * 层主阅读还是评论区阅读状态
 */
type MainOrDissStatus = 'main' | 'diss'
const readConfig: ReadConfig = {
    listIndex: 0,
    dissIndex: 0, // 评论区索引
    dissMaxIndex: 0, // 评论区长度
    mainOrDissStatus: 'main', // main diss
    readStatus: true
}
type ReadList = {
    mainText: string,
    dissLength: number,// 评论区长度
    dissList: { text: string, index: number }[]
}[]
// 阅读列表
const readList: ReadList = []
// 监听页面操作
body.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'q' || event.key === 'Q') {
        readInit() // 阅读初始化
    }
    if (event.altKey && event.key === 'q' || event.key === 'Q') {
        if (readConfig.readStatus == true) { // 播放状态-> 暂停阅读

            console.log('暂停阅读');
            speech.speechPause()
        } else { // 暂停状态 恢复阅读
            console.log('恢复阅读');
            speech.speechResume()
        }
        readConfig.readStatus = !readConfig.readStatus // 变更阅读状态
    }
})

// 监听方向键
document.addEventListener('keydown', function (event) {
    if (!event.altKey || !speech) return
    // 检查方向键
    switch (event.key) {
        case 'ArrowLeft':
            console.log('降低语速');
            speech.setSpeechRateAndVolumeAndPitch({ key: 'rate', type: 'less' }) // 增加语速
            break;
        case 'ArrowRight':
            console.log('增加语速');
            speech.setSpeechRateAndVolumeAndPitch({ key: 'rate', type: 'add' }) // 增加语速
            break;
        case 'ArrowUp':
            console.log('增加音量');
            speech.setSpeechRateAndVolumeAndPitch({ key: 'volume', type: 'add' })
            break;
        case 'ArrowDown':
            console.log('降低音量');
            speech.setSpeechRateAndVolumeAndPitch({ key: 'volume', type: 'less' })
            break;
    }
});

/**
 * 阅读初始化
 */
function readInit() {
    const getReadTextStatus = GetReadText('reply-item')
    if (getReadTextStatus.status == true) {
        PlayText(getReadTextStatus.list)
    }
}
/**
 * 获取阅读文本
 */
function GetReadText(className: string) {
    const list = document.querySelectorAll(`.${className}`)
    const readTextList = []
    list.forEach(item => {
        const childrenInfo = GetChildrenInfo(item.children)
        const mainInfo = GetFloorMainInfo(childrenInfo.main) // 层主信息
        const dissInfo = GetDissInfo(childrenInfo.floor) // 评论层主信息用户信息
        readTextList.push({
            main: mainInfo,
            diss: dissInfo
        })
    })
    if (readTextList.length == 0) {
        return { status: false }
    } else {
        return { status: true, list: readTextList }
    }
}
/**
 * 拆分节点信息
 */
function GetChildrenInfo(children: HTMLCollection) {
    const info = {
        main: {},
        floor: {}
    }
    for (let i = 0; i < children.length; i++) {
        const item = children[i]
        if (item.className == 'root-reply-container') info.main = item
        if (item.className == 'sub-reply-container') info.floor = item
    }
    return info
}


/**
 * 获取用户名称
 */
function GetUserName(element) {
    for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i]
        if (item.className == 'user-name') {
            return item.innerHTML
        }
    }
}
/**
 * 获取用户内容
 */
function GetUserContent(element) {
    for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i]
        if (item.className == 'root-reply') {
            return item.children[0].children[0].innerHTML
        }
    }
}
/**
 * 获取层主信息
 */
function GetFloorMainInfo(element) {
    for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i]
        if (item.className == 'content-warp') {
            const userName = GetUserInfo(item)
            const userContent = GetUserContent(item)
            const info = { name: userName, content: userContent }
            return info
        }
    }
}

/**
 * 获取用户信息
 */
function GetUserInfo(element) {
    for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i]
        if (item.className == 'user-info') {
            return GetUserName(item)
        }
    }
}


/**
 * 获取评论信息
 */
function GetDissInfo(element) {
    const dissList = []
    const list = element.children[0]
    for (let i = 0; i < list.children.length; i++) {
        const item = list.children[i]
        if (item.className == 'sub-reply-item') {
            const info = GetDissUserInfo(item)
            dissList.push(info)
        }
    }
    return dissList
}
/**
 * 获取评论用户信息
 */
function GetDissUserInfo(element) {
    const info = { name: '', content: '' }
    for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i]
        if (item.className == 'sub-user-info') {
            info.name = GetDissUserName(item)
        }
        if (item.className == 'reply-content-container sub-reply-content') {
            info.content = GetDissUserContent(item)
        }
    }
    return info
}


/**
 * 获取用户名称
 */
function GetDissUserName(element) {
    for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i]
        if (item.className == 'sub-user-name') {
            return item.innerHTML
        }
    }
}
/**
 * 获取用户内容
 */
function GetDissUserContent(element) {
    for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i]
        if (item.className == 'reply-content') {
            return item.innerHTML
        }
    }
}



/**
 * 播放指定文本
*/
function PlayText(list) {
    // 转换为阅读队列
    readList.length = 0 // 置空
    readConfig.listIndex = 0
    readConfig.readStatus = true
    for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const temp = {
            mainText: '',
            dissLength: 0,
            dissList: []
        }
        temp.mainText = `层主${item.main.name}留言说：${item.main.content}。` // 层主评论
        temp.dissLength = item.diss.length
        for (let j = 0; j < item.diss.length; j++) {
            const temp = item.diss[j]
            let text = `评论区用户${temp.name}评论说：${temp.content}。` // 评论区评论层主内容
            temp.dissList.push({
                text: text,
                index: j
            })
        }
        readList.push(temp)// 过滤掉img标签

    }
    SetSpeech('main')
}

/**
 * 设置阅读
 */
function SetSpeech(status: MainOrDissStatus) {
    if (readConfig.listIndex >= readList.length) return
    if (status == 'main') {
        speech.setText(readList[readConfig.listIndex].mainText)
    }
    if (status == 'diss') {
        speech.setText(readList[readConfig.listIndex].dissList[readConfig.dissIndex].text)
        readConfig.dissIndex += 1

    }
    speech.speechStart()
    readConfig.listIndex += 1 // 自增索引
}
/**
 * 播放结束
 * @param event 
 */
function speechEnd() {
    if (readConfig.mainOrDissStatus == 'main') {
        SetSpeech('diss')
        readConfig.mainOrDissStatus = 'diss'
    }
    if (readConfig.mainOrDissStatus == 'diss' && readConfig.dissMaxIndex >= readConfig.dissIndex) {
        SetSpeech('main')
        readConfig.mainOrDissStatus = 'main'

    }
}

