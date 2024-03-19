import Game from "./game";
import SceneMain from "./sceneMain";
import SceneSetup from "./sceneSetup";

var game = new Game();

Game.setScene(new SceneSetup());

game.run();
game.stop();