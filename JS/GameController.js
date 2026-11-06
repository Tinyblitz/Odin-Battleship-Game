const [PLAYER1, PLAYER2] = [0,1];
const MODE = {
    PLAYING: 0,
    WAITING: 1,
    MSG: 2,
}

const msgBox = document.createElement('dialog');
msgBox.id = 'game-dialog';


export default function createGame(mainBoard, oppBoard, endFunc) {

    let currentTurn = PLAYER1;

    const players = {
        1: mainBoard,
        2: oppBoard
    }

    let winner = null;

    const actionLog = [];

    let mode = MODE.PLAYING;

    function runTurn() {

    };

    return {
        isPlaying() { if (mode === MODE.PLAYING) return true;},
        shiftTurn() {
            if (currentTurn === PLAYER1) currentTurn = PLAYER2;
            else currentTurn = PLAYER1;
        },
        endTurn() {
            // Open dialog to show what happened in turn
            //mode = MODE.MSG;
            
            let turnPlayer = players[2];
            let enemy = players[1];
            if (currentTurn === PLAYER1) {
                turnPlayer = players[1];
                enemy = players[2];
            }

            const [tarX, tarY] = turnPlayer.probePlayer();
            enemy.receiveAttack(tarX, tarY);

            if (enemy.allSunk()) this.endGame();

            this.shiftTurn();
        },
        endGame() {
            winner  = currentTurn;
            setTimeout(() => alert("winner"), 0);
            endFunc();  
        }
    }
}