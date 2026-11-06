import { screenCtrls, switchScreens } from "./Globals.js";
import { MODE } from "./PlayScreen.js";

const StartScreen = document.getElementById('start-screen');
const btnOptions = [
    {
        text: 'Online',
        func: null
    },
    {
        text: 'Local',
        func: null
    },
    {
        text: 'CPU',
        func: handleCPUBtn
    }
];

export default function StartScreenSetup() {

    const titleText = document.createElement('h1');
    titleText.innerText = 'BATTLESHIP';
    StartScreen.append(titleText);

    const vsText = document.createElement('h2');
    vsText.innerText = 'VS';
    StartScreen.append(vsText);

    btnOptions.forEach(details => {
        const btn = document.createElement('button');
        btn.innerText = details.text;
        btn.addEventListener('click', details.func);
        if (!details.func) btn.disabled = true;     // Remove once functions are all written
        StartScreen.append(btn);
    });

    return {
        moveTo(from) {
            switchScreens(from, StartScreen);
        }
    }
}

function handleCPUBtn() {
    screenCtrls.PLAY.moveTo(StartScreen);
    screenCtrls.PLAY.setPlayMode(MODE.CPU);
}
