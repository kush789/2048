var BOARD = 1;
var PLAYER = 0;

GameManager.prototype.getBestMove = function(grid, depth)
{
    var score = Number.MIN_VALUE;
    var bestMove = 0;

    for (var i = 0; i < 4; i ++)
    {
        var newGrid = grid.clone();
        
        if(newGrid.move(i) === false)
            continue;

        var newScore = this.expectimax(newGrid, depth - 1, BOARD);

        if (newScore > score)
        {
            bestMove = i;
            score = newScore;
        }
    }

    return bestMove;
}

GameManager.prototype.expectimax = function(grid, depth, agent) {

  var self = this;

  if (depth == 0)
    return grid.getScore()

  else if (agent === PLAYER) 
  {
    var score = Number.MIN_VALUE;

    for (var i = 0; i < 4; i ++)
    {
      var newGrid = grid.clone();
      var nextLevel = newGrid.move(i);

      if (nextLevel === false) {
        continue;
      }

      var newScore = this.expectimax(newGrid, depth - 1, BOARD);

      if (newScore > score)
        score = newScore;
    }
    return score;
  }

  else if (agent === BOARD)
  {
    var score = 0;
    var cells = grid.availableCells();
    var totalCells = cells.length;

    for (var i = 0; i < totalCells; i++)
    {
      var newGrid = grid.clone();
      newGrid.insertTile(new Tile(cells[i], 4));
      var newScore = self.expectimax(newGrid, depth - 1, PLAYER);
      if (newScore === Number.MIN_VALUE)
        score += 0;
      else
        score += (0.1 * newScore);

      newGrid = grid.clone();
      newGrid.insertTile(new Tile(cells[i], 2));
      newScore = self.expectimax(newGrid, depth - 1, PLAYER);
      if (newScore === Number.MIN_VALUE)
        score += 0;
      else
        score += (0.9 * newScore);
    }

    score /= totalCells;
    return score;
  }
}
