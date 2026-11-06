import { boardDIMS, directions, GameMSG, GrabState, PlayState, shipPartsRender } from "./Globals.js";
import createShip from "./Ship.js";

export default function createPlayer(isHuman) {

    const pType = isHuman;
    let ships = [];
    let numShipsSunk = 0;

    return {
        makeDecision(board) {
            if (pType) {    // Human Decision
                return [PlayState.colSel - 1, PlayState.rowSel - 1];
            }
            else {      // Computer Decision
                // Randomly select spot
                const possiblePositions = board.flatMap((column,x) =>
                    column.map((cell,y) =>
                        cell.mark === 0
                            ? [x,y]
                            : null
                    ).filter(Boolean)
                );

                const index = Math.floor(Math.random() * possiblePositions.length);
                return possiblePositions[index];

                // To Do: do something with selected positions --> convert to rendering on main board

                // const positionsToCheck = possiblePositions.flatMap((column,x) => 
                // column.map((visits, y) => 
                //     !visits[`visited-Length-${length}`]
                //         ? [x, y]
                //         : null
                //     ).filter(Boolean)
                // );
            }
        },
        createShips(shipDetails) {  // Replaces previous array of ships
            ships = shipDetails.map(ship => {
                const {x,y,dir,length} = ship;
                return createShip(length, x, y, dir)
            });
        },
        get shipDetails() {
            const details = ships.map(ship => {
                const posArr = ship.position;
                return {
                    x: posArr[0],
                    y: posArr[1],
                    length: ship.length,
                    dir: ship.direction
                };
            });
            return details;
        },
        shipThatGotHit(_x,_y) {
            if (ships.length === 0) throw new Error("Accessing hit detection before ships are created");
            for (const ship of ships) {
                if (ship.isTouchingHitbox([_x,_y])) {
                    if (ship.isSunk()) throw new Error('Ship already hit, possible issue with tracking hit attempts');
                    let msg = `Ship hit at [${_x},${_y}]`;   // To Do: replace coordinates with A-J and 1-10 labels
                    ship.hit();

                    // Check if ship is sunk
                    if (ship.isSunk()) {
                        msg += `\nShip length ${ship.length} has sunk!`;
                        numShipsSunk++;
                    }

                    // Send game msg
                    GameMSG.msg = msg;
                    return ship;
                }
            }
            return null;
        },
        areAllShipsSunk() {
            return numShipsSunk === ships.length;
        },
        reset() {
            ships = [];
            numShipsSunk = 0;
        }
    }
}