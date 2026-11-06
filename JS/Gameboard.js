import { boardDIMS, directions, GrabState, PlayState, shipPartsRender } from "./Globals.js";

const [ NO_MARK, HIT, MISS ] = [ 0, 1, 2 ];

const shipLengths = [2,2,2,2,3,3,3,4,4,6];

export default function createGameboard(boardEl) {

    if (!boardEl) throw new Error('board element missing');

    // Standard battleship is A-J rows, 1-10 columns
    const rows = boardDIMS.ROWS, cols = boardDIMS.COLS;

    const board = Array.from(   // Outer array corresponds to x position.  Inner arrays corresponds to y position
        {length: cols}, 
        () => Array.from(
            {length: rows}, 
            () => {
                return {
                    element: null,
                    mark: NO_MARK
                };
            })
        );

    // Add Cells
    for (let x = cols - 1; x >= 0; x--) {
        for (let y = rows - 1; y >= 0; y--) {
            const cellEl = document.createElement('div');
            cellEl.classList.add('cell');
            const rowStart = y+1; 
            const colStart = x+1;
            cellEl.style.gridArea = `${rowStart} / ${colStart} / ${rowStart+1} / ${colStart+1}`;
            cellEl.addEventListener('mouseover', () => {
                if (GrabState.isGrabbing && GrabState.targetBoard.element === boardEl) {
                    GrabState.rowStart = rowStart;
                    GrabState.colStart = colStart;      
                    GrabState.highlightShipSpot(true);
                }
                if (PlayState.isPlaying && PlayState.targetBoard.element === boardEl) {
                    if (PlayState.rowSel === rowStart && PlayState.colSel === colStart) return;
                    PlayState.rowStart = rowStart;
                    PlayState.colStart = colStart;
                    PlayState.highlightSpot(true);
                    cellEl.onclick = () => {
                        clearSelection();
                        cellEl.textContent = 'X';
                        PlayState.rowSel = rowStart;
                        PlayState.colSel = colStart;
                    }
                }
            });
            cellEl.addEventListener('mouseleave', () => {
                if (GrabState.isGrabbing && GrabState.targetBoard.element === boardEl) {
                    GrabState.highlightShipSpot(false);
                }
                if (PlayState.isPlaying && PlayState.targetBoard.element === boardEl) {
                    PlayState.highlightSpot(false);
                    cellEl.onclick = null;
                }
            });

            boardEl.prepend(cellEl);
            board[x][y].element = cellEl;
        }
    }

    function clearSelection() {
        if (PlayState.rowSel && PlayState.colSel) {
            board[PlayState.colSel - 1][PlayState.rowSel - 1].element.textContent = '';
            PlayState.colSel = null;
            PlayState.rowSel = null;
        }
    }

    function renderCell(_x,_y, type, dir = null, part = null) {
        const cell = board[_x][_y].element;
        const styleObj = type === "MISS" ? shipPartsRender[type] :
            dir === directions.VERTICAL ?
                shipPartsRender.VERTICAL[part][type] :
                shipPartsRender.HORIZONTAL[part][type] ; 
        Object.assign(cell.style, styleObj);
    }

    function resetCell(_x,_y) {
        const cell = board[_x][_y].element;
        Object.assign(cell.style, shipPartsRender.RESET);
    }

    function renderShips(shipDetails) {
        shipDetails.forEach(ship => {
             
            const {x,y,dir,length} = ship;

            // Display Ship
            for (let i = 0; i < length; i++) {
                let part = "MIDDLE";
                if (i === 0) part = "FRONT";
                if (i === length - 1) part = "BACK";
                dir === directions.VERTICAL ? 
                    renderCell(x,y + i, "DEFAULT", dir, part) :
                    renderCell(x + i,y, "DEFAULT", dir, part) ;
            }
        });
    }

    function fullRenderReset() {
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                // To do: Maybe do something with Mark here
                resetCell(x,y);
            }
        }
    }

    let linkedPlayer = null;

    return {
        linkBoard() {
            return {
                element: boardEl,
                data: board
            }
        },
        set player(_p) { linkedPlayer = _p; },
        isSpotAttackedAlready(_x,_y) {
            return Boolean(board[_x][_y].mark);
        },
        receiveAttack(_x,_y) {
            let result = MISS;

            // Check if attack hit a ship
            const ship = linkedPlayer.shipThatGotHit(_x,_y);
            if (ship) {
                result = HIT;
                const part = ship.shipPart(_x,_y);
                renderCell(_x,_y, "HIT", ship.direction, part);
            }
            else {
                renderCell(_x,_y, "MISS");
            }

            // Record result
            board[_x][_y].mark = result;
        },
        allSunk() {
            return linkedPlayer.areAllShipsSunk();
        },
        setPositions(shipDetails) { 
            linkedPlayer.createShips(shipDetails);
        },
        setAndRenderPositions(shipDetails) {    // accepts array of objects, each giving position, orientation, and ship length
            renderShips(shipDetails);
            this.setPositions(shipDetails);
        },
        getShipDetails() {  // Returns array of objects containing the stats of each ship
            return linkedPlayer.shipDetails;
        },
        reset() {   // Reset marks on board for new game with same ship positions
            fullRenderReset();

            // To Do: Render ships.  Make new ship details using linkedplayer
            // renderShips(shipDetails)

        },
        wipeBoard() {   // Clear board of ships and marks
            linkedPlayer.reset();
            fullRenderReset();
        },
        probePlayer() {
            return linkedPlayer.makeDecision(board);
        },
        clearSelection
    }
}