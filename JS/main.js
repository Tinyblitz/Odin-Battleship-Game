import createGameboard from "./Gameboard.js";
import createShipHolder from "./ShipPlacement.js";
import { screenCtrls, GrabState } from "./Globals.js";
import createPlayer from "./PlayerController.js";
import StartScreenSetup from "./StartScreen.js";
import PlayScreenSetup from "./PlayScreen.js";

// SETUP

screenCtrls.START = StartScreenSetup();
screenCtrls.PLAY = PlayScreenSetup();