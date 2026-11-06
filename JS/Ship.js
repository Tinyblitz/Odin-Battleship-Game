import { directions } from "./Globals.js";

export default function createShip(_l, _x = null, _y = null, _d = directions.VERTICAL) {

    const length = _l;
    let hits = 0;
    let x = _x, y = _y;  // Root: highest and most left position of ship
    let dir = _d;

    return {
        get position() { return [x,y]; },
        set position(arr) {
            x = arr[0];
            y = arr[1]
        },
        get length() { return length },
        get direction() { return dir },
        set direction(d) {dir = d; },
        toggleDir() { 
            if (dir === directions.VERTICAL) dir = directions.HORIZONTAL;
            else dir = directions.VERTICAL;
        },
        isTouchingHitbox(arr) {

            if (x === null || y === null) return false;

            const targetX = arr[0];
            const targetY = arr[1];
            switch(dir) {
                case directions.HORIZONTAL:
                    if (targetY !== y) return false;
                    if (targetX < x || targetX >= x + length) return false;
                    break;
                case directions.VERTICAL:
                    if (targetX !== x) return false;
                    if (targetY < y || targetY >= y + length) return false;
                    break;
                default:
                    return false;
            }
            return true;
        },
        hit() { if (hits < length) hits++; },
        isSunk() { 
            if (length === hits) return true;
            return false;
        },
        shipPart(tarX,tarY) { // Assumes coordinate is touching ship
            if (tarX === x && tarY === y) return 'FRONT';
            if (tarX === x + length - 1 || tarY === y + length - 1) return 'BACK';
            return 'MIDDLE';
        },
        reset() {
            hits = 0;
        }
    }
}