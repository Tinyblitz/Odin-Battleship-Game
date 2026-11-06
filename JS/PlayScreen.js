import { screenCtrls, switchScreens, GrabState, PlayState } from "./Globals.js";
import createGameboard from "./Gameboard.js";
import createPlayer from "./PlayerController.js";
import createShipHolder from "./ShipPlacement.js";
import createGame from "./GameController.js";

const PlayScreen = document.getElementById('play-screen');

export const MODE = {
    ONLINE: 0,
    LOCAL: 1,
    CPU: 2
}

// TO DO: some issue with the CPU logic.  It's still counting spots that should have been discounted.  Probably try to visually debug it

export default function PlayScreenSetup() {

    let gameMode = null;
    const CPU_DECISION_TIME = 1000;

    const backBtn = document.createElement('button');
    backBtn.id = 'back-btn';
    backBtn.innerText = "Back";
    backBtn.addEventListener('click', () => {
        
        // To Do: open module asking if player is okay with losing data
        // Reset Board
        mainBoard.wipeBoard();
        // Reset GrabState helper and temp ships
        resetShipPlacement();
        if (!PlayState.isPlaying){
            // Hide ship holder
            resetShipHolder();
        }
        else {
            quitGame();
        }
        // Reset play button
        rightBoardBtn.disabled = true;

        screenCtrls.START.moveTo(PlayScreen);
    })
    PlayScreen.append(backBtn);

    const boardElOne = document.createElement('div');
    boardElOne.id = 'player-board-1';
    boardElOne.classList.add('board');
    document.getElementById('play-area').append(boardElOne);

    const boardElTwo = document.createElement('div');
    boardElTwo.id = 'player-board-2';
    boardElTwo.classList.add('board');
    boardElTwo.style.visibility = 'hidden';
    document.getElementById('play-area').append(boardElTwo);

    const mainBoard = createGameboard(boardElOne);
    const oppBoard = createGameboard(boardElTwo);

    const leftBoardBtn = document.createElement('button');
    leftBoardBtn.id = 'left-board-btn';
    leftBoardBtn.textContent = "Edit";
    document.getElementById('board-controls').append(leftBoardBtn);

    const centerBoardBtn = document.createElement('button');
    centerBoardBtn.id = 'center-board-btn';
    centerBoardBtn.style.visibility = 'hidden';
    document.getElementById('board-controls').append(centerBoardBtn);

    const rightBoardBtn = document.createElement('button');
    rightBoardBtn.id = 'right-board-btn';
    rightBoardBtn.textContent = "Play";
    rightBoardBtn.disabled = true;
    document.getElementById('board-controls').append(rightBoardBtn);

    // To Do: make this look better, this array probably can go into Globals
    const shipL = [6,4,2,4,2,3,3,2,2,3];

    const shipHolder = createShipHolder();

    leftBoardBtn.onclick = editShipPlacement;
    //leftBoardBtn.onmouseenter = () => console.log(GrabState.placedShips);
    rightBoardBtn.onclick = startGame;
    centerBoardBtn.onclick = null;

    function resetButtons() {
        leftBoardBtn.textContent = "Edit";
        leftBoardBtn.onclick = editShipPlacement;

        rightBoardBtn.textContent = "Play";
        rightBoardBtn.onclick = startGame;

        centerBoardBtn.style.visibility = 'hidden';
    }

    function startGame() { // Sets up game instance

        // Set opponent board as interactable
        // To Do: adjust to allow a board to be a parameter
        PlayState.targetBoard = oppBoard.linkBoard();
        // Create Game Scenario
        // To Do: randomize ship positions for CPU
        // CPU mode
        //oppBoard.player

        PlayState.gameINST = createGame(mainBoard, oppBoard, quitGame);

        // Set random positons for CPU ships using helper ships first
        shipHolder.randomize();
        // Transfer positions from helper ships to CPU ships
        oppBoard.setPositions(shipHolder.shipPositions);
        // oppBoard.setAndRenderPositions(shipHolder.shipPositions);  // Debug: Check where CPU ships are placed
        
        // Show opponent board
        boardElTwo.style.visibility = '';

        // Adjust buttons
        leftBoardBtn.textContent = "Quit";
        rightBoardBtn.textContent = "Confirm";
        centerBoardBtn.textContent = "Log";
        centerBoardBtn.style.visibility = '';
        
        // Change action of left button to end game instance
        leftBoardBtn.onclick = quitGame;
        // Change action of right button to interact with game controller - cofirm target cell
        rightBoardBtn.onclick = confirmShot;
        // Change action of center button to display log
        centerBoardBtn.onclick = null;

        // To Do: remove, transfered this line to player controller
        PlayState.isPlaying = true;

        // To Do: only allow point when it is the player's turn
        boardElTwo.style.cursor = 'pointer';
    }

    function quitGame() {
        boardElTwo.style.visibility = 'hidden';
        resetButtons();
        PlayState.isPlaying = false;

        // Reset boards visually and behind the scenes
        // Reset selection
        oppBoard.clearSelection();

        // Reset render and player ships
        // To Do: Might have to consider alternative option for local play
        oppBoard.wipeBoard();

        PlayState.targetBoard = null;

        PlayState.gameINST = null;
    }

    function confirmShot() {

        if (!PlayState.colSel || !PlayState.rowSel) return;
        PlayState.gameINST.endTurn();
        oppBoard.clearSelection();

        // If CPU opponent
        if (gameMode === MODE.CPU) {
            PlayState.isPlaying = false;
            setTimeout(() => {
                PlayState.gameINST.endTurn();
                PlayState.isPlaying = true;
            }, CPU_DECISION_TIME);
        }
    }

    function editShipPlacement() {
  
        // To Do: adjust to allow a board to be a parameter
        GrabState.targetBoard = mainBoard.linkBoard();

        resetShipPlacement();

        shipHolder.show(mainBoard.getShipDetails());
        mainBoard.wipeBoard();

        leftBoardBtn.textContent = "Reset";
        leftBoardBtn.onclick = resetShipPlacement;

        rightBoardBtn.textContent = "Confirm";
        rightBoardBtn.onclick = confirmShipPlacement;
        rightBoardBtn.disabled = false;

        centerBoardBtn.style.visibility = 'visible';
        centerBoardBtn.textContent = "Randomize";
        centerBoardBtn.onclick = () => shipHolder.randomizeAndDisplay();
    }

    function resetShipPlacement() {
        shipHolder.resetAll();
    }

    function resetShipHolder() {
        shipHolder.hide();
        resetButtons();
    }

    function confirmShipPlacement() {
        if (!shipHolder.areAllShipsPlaced()) {
            alert('Not all ships are placed!');
            return;
        }

        // Update ships
        mainBoard.setAndRenderPositions(shipHolder.shipPositions);

        // Reset Ship Placement Helper
        resetShipHolder();
        //GrabState.targetBoard = null;
    }

    return {
        moveTo(from) {
            switchScreens(from, PlayScreen);
        },
        setPlayMode(mode) {
            gameMode = mode;
            switch(mode) {
                case MODE.ONLINE:
                    break;
                case MODE.LOCAL:
                    break;
                case MODE.CPU:
                    const player1 = createPlayer(true);
                    const player2 = createPlayer(false);

                    mainBoard.player = player1;
                    oppBoard.player = player2;
                    break;
                default:
                    throw new Error('Play Mode not set or incorrect value');
                    break;
            }
        }
    }
}