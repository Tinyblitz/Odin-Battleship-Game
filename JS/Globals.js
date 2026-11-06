export const screenCtrls = {
    START: null,
    PLAY: null
}

export const playerType = {
    AI: 0,
    HUMAN: 1
}

export const boardDIMS = {
    ROWS: 10,
    COLS: 10
}

export const directions = {
    HORIZONTAL: 0,
    VERTICAL: 1
}

const shipStyles = {
    DEFAULT: {
        bg: 'blue',
        border: '1px solid red'
    },
    HIT: {
        bg: 'red',
        border: '1px solid black'
    }
}

export const shipPartsRender = {
    RESET: {
        backgroundColor: '',
        border: ''
    },
    HORIZONTAL: {
        FRONT: {
            DEFAULT: {
                backgroundColor: shipStyles.DEFAULT.bg,
                border: shipStyles.DEFAULT.border,
                borderRight: 'none'
            },
            HIT: {
                backgroundColor: shipStyles.HIT.bg,
                border: shipStyles.HIT.border,
                borderRight: 'none'
            }
        },
        MIDDLE: {
            DEFAULT: {
                backgroundColor: shipStyles.DEFAULT.bg,
                border: 'none',
                borderTop: shipStyles.DEFAULT.border,
                borderBottom: shipStyles.DEFAULT.border
            },
            HIT: {
                backgroundColor: shipStyles.HIT.bg,
                border: 'none',
                borderTop: shipStyles.HIT.border,
                borderBottom: shipStyles.HIT.border
            }
        },
        BACK: {
            DEFAULT: {
                backgroundColor: shipStyles.DEFAULT.bg,
                border: shipStyles.DEFAULT.border,
                borderLeft: 'none'
            },
            HIT: {
                backgroundColor: shipStyles.HIT.bg,
                border: shipStyles.HIT.border,
                borderLeft: 'none'
            }
        }
    },
    VERTICAL: {
        FRONT: {
            DEFAULT: {
                backgroundColor: shipStyles.DEFAULT.bg,
                border: shipStyles.DEFAULT.border,
                borderBottom: 'none'
            },
            HIT: {
                backgroundColor: shipStyles.HIT.bg,
                border: shipStyles.HIT.border,
                borderBottom: 'none'
            }
        },
        MIDDLE: {
            DEFAULT: {
                backgroundColor: shipStyles.DEFAULT.bg,
                border: 'none',
                borderRight: shipStyles.DEFAULT.border,
                borderLeft: shipStyles.DEFAULT.border
            },
            HIT: {
                backgroundColor: shipStyles.HIT.bg,
                border: 'none',
                borderRight: shipStyles.HIT.border,
                borderLeft: shipStyles.HIT.border
            }            
        },
        BACK: {
            DEFAULT: {
                backgroundColor: shipStyles.DEFAULT.bg,
                border: shipStyles.DEFAULT.border,
                borderTop: 'none'
            },
            HIT: {
                backgroundColor: shipStyles.HIT.bg,
                border: shipStyles.HIT.border,
                borderTop: 'none'
            }
        }
    },
    MISS: {
        backgroundColor: 'white',
        border: '1px solid black',
    }
}

export const GameMSG = {
    msg: ''
};

export const GrabState = {
    placedShips: [],
    isGrabbing: false,
    shipLength: null,
    rowStart: null,
    colStart: null,
    canBePlaced: false,
    orientation: null,
    targetBoard: null,
    determineIfCanPlace() {
        // Check if ship fits in dimensions of the board
        const canPlaceWithinBoard = this.orientation === directions.VERTICAL ? 
            (this.rowStart - 1 + this.shipLength - 1 >= boardDIMS.ROWS ? false : true) :
            (this.colStart - 1 + this.shipLength - 1 >= boardDIMS.COLS ? false : true) ;

        // Check if ship overlaps with any currently placed ships
        const doesNotOverlap = !this.placedShips.some(shipTarget => {
            const positionsToCheck = [];
            for (let i = 0; i < this.shipLength; i++) {
                let tarX = this.colStart - 1;
                let tarY = this.rowStart - 1;
                let pos = this.orientation === directions.VERTICAL ? [tarX, tarY + i] : [tarX + i, tarY];
                positionsToCheck.push(pos);
            }
            return positionsToCheck.some((tarPos,index) => shipTarget.ship.isTouchingHitbox(tarPos));
        });;

        if (canPlaceWithinBoard && doesNotOverlap) this.canBePlaced = true;
        else this.canBePlaced = false;
    },
    highlightShipSpot(isHilighting) {   // When parameter is false -> remove highlight.  When true -> add highlight
        if (!this.colStart || !this.rowStart) return;
        const x = this.colStart - 1;
        const y = this.rowStart - 1;
        this.determineIfCanPlace();
        const classLabel = this.canBePlaced ? 'dragged-over-safe' : 'dragged-over-error';
        for (let i = 0; i < this.shipLength; i++) {
            if ((this.orientation === directions.VERTICAL ? y : x)+i >= (this.orientation === directions.VERTICAL ? boardDIMS.ROWS : boardDIMS.COLS)) break;
            const targetEl = this.orientation === directions.VERTICAL ? this.targetBoard.data[x][y+i].element : this.targetBoard.data[x+i][y].element;
            if (isHilighting) targetEl.classList.add(classLabel);
            else targetEl.classList.remove(classLabel);
        }      
    }
}

export const PlayState = {
    gameINST: null,
    isPlaying: false,
    targetBoard: null,
    colStart: null,
    rowStart: null,
    colSel: null,
    rowSel: null,
    canSelect: true, // To Do: set to false when done
    highlightSpot(isHilighting) {
        if (!this.colStart || !this.rowStart) return;
        const x = this.colStart - 1;
        const y = this.rowStart - 1;
        // To Do: determine if already picked
        const classLabel = this.canSelect ? 'dragged-over-safe' : 'dragged-over-error';
        const targetEl = this.targetBoard.data[x][y].element;
        if (isHilighting) targetEl.classList.add(classLabel);
        else targetEl.classList.remove(classLabel);
    }
}

export function switchScreens(fromScreen, toScreen) { // Parameters are elements
    fromScreen.style.display = 'none';
    toScreen.style.cssText = '';
}