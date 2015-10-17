// Wait till the browser is ready to render the game (avoids glitches)
// 0: up, 1: right, 2: down, 3: left

window.requestAnimationFrame(function () {
  var game = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

	function AI() {
	    setTimeout(function () {

	    	var future = 0;

	    	if (game.grid.availableCells().length < 4)
	    		future = 6;
	    	else
	    		future = 4;
			game.move(game.getBestMove(game.grid, future));

			AI();

	    }, 50);
	}
	AI();
});
