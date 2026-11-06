import { boardDIMS, directions, GrabState, shipPartsRender } from "./Globals.js";
import createShip from "./Ship.js";

// Create area to hold ships to then be placed on linked baord
const shipHolder = document.createElement('div');
shipHolder.id = 'ship-holder';
shipHolder.classList.add('board');
shipHolder.style.visibility = 'hidden';
document.getElementById('play-area').prepend(shipHolder);

/* ----- TO DO ----- */
// Put in cells for the ship targets so you can swap out ship renders
// Code is already there, just commented out.  Need adjustments

// Pre-determined, fixed positions of ships in ship holder
const baseShipDetails = [
    {
        length: 6,
        shipHolderGridArea: '3 / 2 / 9 / 3'
    },
    {
        length: 4,
        shipHolderGridArea: '2 / 4 / 6 / 5'
    },
    {
        length: 3,
        shipHolderGridArea: '7 / 4 / 10 / 5'
    },
    {
        length: 4,
        shipHolderGridArea: '2 / 6 / 6 / 7'
    },
    {
        length: 3,
        shipHolderGridArea: '7 / 6 / 10 / 7'
    },
    {
        length: 2,
        shipHolderGridArea: '3 / 8 / 5 / 9'
    },
    {
        length: 3,
        shipHolderGridArea: '6 / 8 / 9 / 9'
    },
    {
        length: 2,
        shipHolderGridArea: '2 / 10 / 4 / 11'
    },
    {
        length: 2,
        shipHolderGridArea: '5 / 10 / 7 / 11'
    },
    {
        length: 2,
        shipHolderGridArea: '8 / 10 / 10 / 11'
    }
]

const ships = baseShipDetails.map(details => createShipAndContainer(details));

function placeShipElement(shipEl, ship) {
    const colStart = ship.position[0] + 1;
    const rowStart = ship.position[1] + 1;
    if (ship.direction === directions.VERTICAL) {
        shipEl.style.gridArea = 
            `${rowStart} /
                ${colStart} /
                ${rowStart + ship.length} /
                ${colStart + 1}`;
    }
    else {
        shipEl.style.gridArea = 
            `${rowStart} /
                ${colStart} /
                ${rowStart + 1} /
                ${colStart + ship.length}`;
    }
    GrabState.targetBoard.element.append(shipEl);
}

function createShipAndContainer(details) {

    // ship stats
    const ship = createShip(details.length);
    let isPlaced = false;
    let placedShips = [];

    // Create/ visualize an origin point of each ship on the ship holder
    const shipContainer = document.createElement('div');
    shipContainer.classList.add('ship-container');      // Style: black border to outline origin point
    shipContainer.style.gridArea = details.shipHolderGridArea;
    shipHolder.append(shipContainer);

    const shipEl = document.createElement('div');
    shipEl.classList.add('ship');

    //Delete:  Attempt to make parts of the ships in the shipholder interactable.  
    // Maybe useful later to draw actual ships

    // shipEl.style.display = 'grid';
    // shipEl.style.gridTemplateRows = `repeat(${details.length},1fr)`;
    // shipEl.style.gridTemplateColumns = '1fr';

    // for (let i = 0; i < details.length; i++) {
    //     const shipPart = document.createElement('div');
    //     shipPart.style.backgroundColor = 'transparent';

    //     shipPart.onmouseover = function () {
    //         if (!GrabState.isGrabbing || !isPlaced) return;
    //         // When approaching from top, the set coordinates are already for a position where ship cannot be isPlaced.  All other directions are the issue though.
    //         // // GrabState.rowStart = GrabState.rowStart + i + 1;
    //         GrabState.colStart = GrabState.colStart + 1;
    //         GrabState.highlightShipSpot(true);
    //         shipPart.style.backgroundColor = 'green';
    //     }
    //     shipPart.onmouseleave = function () {
    //         if (!GrabState.isGrabbing || !isPlaced) return;
    //         GrabState.highlightShipSpot(false);
    //         shipPart.style.backgroundColor = 'transparent';
    //     }

    //     shipEl.append(shipPart);
    // }

    shipEl.onmousedown = handleClickAndHold;

    function reset() {
        shipEl.style.gridArea = details.shipHolderGridArea;
        shipHolder.append(shipEl);
        shipEl.style.transform = "rotate(0)";
        isPlaced = false;
        ship.position = [null,null];
        ship.direction = directions.VERTICAL;
    }

    function handleClickAndHold(e) {
        e.preventDefault();

        isPlaced = false;

        placedShips = ships.filter(shipTarget => shipTarget.placed === true);
        placedShips.forEach(shipTarget => shipTarget.element.style.pointerEvents = 'none');     // Let's board cell events fire since ships sit on top
        GrabState.placedShips = placedShips;

        //Delete
        // shipEl.style.gridTemplateRows = `repeat(${details.length},1fr)`;
        // shipEl.style.gridTemplateColumns = '1fr';

        // Set ship to follow cursor based on position relative to the ship holder or board
        shipEl.style.position = "absolute";
        document.body.style.cursor = "grabbing";
        shipEl.style.zIndex = "100";
        shipEl.style.pointerEvents = "none";
        // Center ship on cursor
        shipEl.style.width = shipContainer.offsetWidth + "px";
        shipEl.style.height = shipContainer.offsetHeight + "px";
        shipEl.style.top = e.clientY - shipContainer.offsetHeight / 2 + "px";
        shipEl.style.left = e.clientX - shipContainer.offsetWidth / 2 + "px";
        // Set grab state to communicate with grid cells (highlight grid cells)
        GrabState.isGrabbing = true;
        GrabState.shipLength = details.length;
        GrabState.orientation = ship.direction;
        // Ship element is tied to how the corresponding ship container is displayed (which is always vertical)
        shipEl.style.transform = ship.direction === directions.VERTICAL ? "rotate(0)" : "rotate(-90deg)";
        // call a function when drag start
        document.onmouseup = handleMouseRelease;
        // call a function whenever the cursor moves
        document.onmousemove = handleDragging;
        // call a function whenever mouse wheel is used
        document.onwheel = handleWheel;
        // Remove ability for ship to be placed when leave designated drop area (player board)
        GrabState.targetBoard.element.onmouseleave = () => {
            GrabState.canBePlaced = false;
            GrabState.rowStart = null;
            GrabState.colStart = null;
        }
    }

    function handleDragging(e) {
        e.preventDefault();
        // set the element's position relative to cursor
        shipEl.style.top = e.clientY - shipContainer.offsetHeight / 2 + "px";
        shipEl.style.left = e.clientX - shipContainer.offsetWidth / 2 + "px";
    }

    function handleMouseRelease() {

        // Make isPlaced ships interactable again
        placedShips.forEach(shipTarget => shipTarget.element.style.pointerEvents = '');

        // stop moving when mouse is released
        shipEl.style.position = "relative";
        document.body.style.cursor = "auto";
        shipEl.style.zIndex = "0";
        shipEl.style.top = "";
        shipEl.style.left = "";
        shipEl.style.width = 'auto';
        shipEl.style.height = 'auto';
        shipEl.style.pointerEvents = "auto";
        shipEl.style.transform = "rotate(0)";

        if (GrabState.canBePlaced) {
            ship.position = [GrabState.colStart - 1, GrabState.rowStart - 1];       // Subtract one to set 0 as the lowest number
            ship.direction = GrabState.orientation;
            placeShipElement(shipEl, ship);
            isPlaced = true;
        }
        else { reset(); }

        // Unhighlight cells
        if (GrabState.rowStart !== null && GrabState.colStart !== null) {
            GrabState.highlightShipSpot(false);
            GrabState.rowStart = null;
            GrabState.colStart = null;
        }

        // Inform board cells
        GrabState.isGrabbing = false;
        GrabState.shipLength = null;
        GrabState.orientation = null;
        GrabState.canBePlaced = false;

        // Remove event listeners
        GrabState.targetBoard.element.onmouseleave = null;
        document.onmouseup = null;
        document.onmousemove = null;
        document.onwheel = null;
    }

    // Shifts orientation between vertical and horizontal positions
    function handleWheel(e) {
        if (e.deltaY < 0 && GrabState.orientation !== directions.HORIZONTAL) {
            // Wheel up
            // Convert to horizontal orientation
            shipEl.style.transform = "rotate(-90deg)";
            GrabState.highlightShipSpot(false);
            GrabState.orientation = directions.HORIZONTAL;
            GrabState.highlightShipSpot(true);
        } 
        else if (e.deltaY > 0 && GrabState.orientation !== directions.VERTICAL){
            // Wheel down
            // Convert to vertical orientation
            shipEl.style.transform = "rotate(0)";
            GrabState.highlightShipSpot(false);
            GrabState.orientation = directions.VERTICAL;
            GrabState.highlightShipSpot(true);
        }
    }

    reset();
    
    return {
        reset,
        set placed(val) { isPlaced = val; },
        get placed() { return isPlaced; },
        get ship() { return ship },
        get element() { return shipEl },
        get stats() {
            return {
                x: ship.position[0],
                y: ship.position[1],
                length: ship.length,
                dir: ship.direction
            }
        },
        set stats(obj) {
            const {x,y,dir} = obj;
            ship.position = [x,y];
            ship.direction = dir;
            isPlaced = true;
        }
    }
}

// Ship Holder: starting point for ships before user places them on their board
export default function createShipHolder() {

    // Only considering default board state
    function getPossiblePositions() {

        // Obtain array of unique ship lengths
        // Not writing in directly incase I want to add more ships of different lengths
        const shipLengths = Array.from(
            new Set(baseShipDetails.map(ship => ship.length))
        ).sort((a, b) => b - a);

        // Create empty copy of board data
        const positions = GrabState.targetBoard.data.map((column,x) => Array.from(
            { length: column.length},
            (_,y) => {
                // Create Object that tracks if a cell has been checked for whether a ship can be placed
                const visitObj = {};
                // Preset cells as visited if ship wouldn't fit within the board's dimensions 
                // for both horizontal and vertical orientations
                for (const length of shipLengths) {
                    visitObj[`visited-Length-${(length)}`] = 
                        (x + length > boardDIMS.COLS) && (y + length > boardDIMS.ROWS)
                }
                return visitObj;
            }
        ));

        return positions;
    }

    function randomizePositions() {
        const placedShips = [];
        const possiblePositions = getPossiblePositions();

        for (const shipTarget of ships) {
            const length = shipTarget.ship.length;
            GrabState.shipLength = length;

            const positionsToCheck = possiblePositions.flatMap((column,x) => 
                column.map((visits, y) => 
                    !visits[`visited-Length-${length}`]
                        ? [x, y]
                        : null
                    ).filter(Boolean)
            );

            do {
                // Rare Edge Case of no position usable
                if (positionsToCheck.length === 0) throw new Error("Not a single position works for ship placement");

                // Random positions
                const index = Math.floor(Math.random() * positionsToCheck.length);
                const [posX, posY] = positionsToCheck[index];
                GrabState.colStart = posX + 1;
                GrabState.rowStart = posY + 1;

                // Remove looked at position
                positionsToCheck.splice(index, 1);

                // Random direction
                const randDir = Math.floor(Math.random() * 2);
                let dir = randDir === 1 ? directions.VERTICAL : directions.HORIZONTAL;

                for (let i = 0; i < 2; i++) {   // Check both vertical and horizontal layouts

                    if (dir === directions.VERTICAL) dir = directions.HORIZONTAL;
                    else dir = directions.VERTICAL;

                    GrabState.orientation = dir;
                    GrabState.determineIfCanPlace();
                    if (GrabState.canBePlaced) {
                        shipTarget.ship.position = [posX,posY];
                        shipTarget.ship.direction = GrabState.orientation;
                        shipTarget.placed = true;
                        break;
                    }
                }
            } while (!GrabState.canBePlaced)

            // Remove spots the ship holds from possible positions
            const [x,y] = shipTarget.ship.position;
            for (let i = 0; i < length; i++) {
                const visitObj = shipTarget.ship.direction === directions.VERTICAL ? 
                    possiblePositions[x][y + i] :
                    possiblePositions[x + i][y] ;
                for (const key in visitObj) {
                    visitObj[key] = true;
                }
            }

            placedShips.push(shipTarget);
            GrabState.placedShips = placedShips;
        }
    }

    function linkShips(shipDetails) {    // Takes an array of objects to transfer player's ships data to the helper ones
        const arr = [...shipDetails];
        for (const shipTarget of ships) {
            const tarLength = shipTarget.ship.length;
            const tarIndex = arr.findIndex(obj => obj.length === tarLength);
            const [tarShipObj] = arr.splice(tarIndex,1);
            shipTarget.stats = tarShipObj;
        }
    }

    return {
        hide() { 
            ships.forEach(shipTarget => shipHolder.append(shipTarget.element));
            shipHolder.style.visibility = 'hidden'; 
        },
        show(shipDetails) {
            if (shipDetails.length) {
                linkShips(shipDetails);
                // Append temp ships to board for visualization
                ships.forEach(shipTarget => {
                    GrabState.targetBoard.element.append(shipTarget.element);
                    placeShipElement(shipTarget.element,shipTarget.ship);
                    // Update placedShips array
                    GrabState.placedShips.push(shipTarget);
                });   
            }
            shipHolder.style.visibility = 'visible';
        },
        resetAll() { 
            ships.forEach(shipTarget => shipTarget.reset());
            GrabState.placedShips = [];
        },
        areAllShipsPlaced() { return !ships.some(shipTarget => shipTarget.placed === false); },
        randomize() {
            this.resetAll();
            randomizePositions();
        },
        randomizeAndDisplay() {
            this.randomize();
            // Place ship elements on board element
            ships.forEach(shipTarget => placeShipElement(shipTarget.element, shipTarget.ship));
        },
        get shipPositions() { return ships.map(shipTarget => shipTarget.stats); }
    }
}