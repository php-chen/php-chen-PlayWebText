import type { PlasmoCSConfig } from 'plasmo'
export const config: PlasmoCSConfig = {
    matches: ['*://*.baidu.com/*'],
    world: "MAIN"
}

console.log('这是百度');
