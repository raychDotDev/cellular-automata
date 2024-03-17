import Game from "./game";
import SceneMain from "./sceneMain";

var game = new Game();

game.setScene(new SceneMain());

game.run();
game.stop();