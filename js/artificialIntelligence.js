
function getBestScore(depth, grid) {

  if (depth === 1)
    return {"moved" : true, "score" : grid.getScore()};

  var maxScore = -999999;

  for (var i = 0; i < 4; i++)
  {
    var score = 0;
    var newGrid = grid.clone();
    var moved = newGrid.move(i);

    if (moved === false) {
      continue;
    }

    var cells = newGrid.availableCells();
    var totalCells = cells.length;

    if (totalCells === 0)
      return maxScore;

    for (var k = 0; k < totalCells; k ++)
    {
      anotherNewGrid = newGrid.clone();
      anotherNewGrid.insertTile(new Tile(cells[k], 4));
      var nextLevel = getBestScore(depth - 1, anotherNewGrid);
      if (nextLevel["moved"] === true)
        score += (0.1 * nextLevel["score"]);

      anotherNewGrid = newGrid.clone();
      anotherNewGrid.insertTile(new Tile(cells[k], 2))
      nextLevel = getBestScore(depth - 1, anotherNewGrid);
      if (nextLevel["moved"] === true)
        score += (0.9 * nextLevel["score"]);
    }
    
    score /= totalCells;

    if (score > maxScore)
      maxScore = score;
  }

  if (maxScore === -999999)
    return {"moved" : false, "score" : maxScore};
  else
    return {"moved" : true, "score" : maxScore};
}

move = ["up", "right", "down", "left"]

GameManager.prototype.getBestMove = function (depth) {

  var self = this;
  var bestScore = -9999;
  var bestMove = -1;
  var moves = [];
  
  for (var i = 0; i < 4; i++)
  {
    var newGrid = self.grid.clone();
    var nextLevel = newGrid.move(i);

    if (nextLevel === false) {
      continue;
    }

    var score = 0;
    var cells = newGrid.availableCells();
    var totalCells = cells.length;

    for (var k = 0; k < totalCells; k ++)
    {
      anotherNewGrid = newGrid.clone();
      anotherNewGrid.insertTile(new Tile(cells[k], 4));

      var next = getBestScore(depth - 1, anotherNewGrid);
      if (next["moved"] === true)
        score += (0.1 * next["score"]);

      anotherNewGrid = newGrid.clone();
      anotherNewGrid.insertTile(new Tile(cells[k], 2));
      next = getBestScore(depth - 1, anotherNewGrid);
      if (next["moved"] === true)
        score += (0.9 * next["score"]);
    }
  
    score /= totalCells;

    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}