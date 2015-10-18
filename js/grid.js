function Grid(size, previousState) {

  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};

Grid.prototype.countTileSum = function () {

  var gameGrid = this;
  var tileCount = 0;
  var gridTileSum = 0;

  for (var i = 0; i < gameGrid.size; i++)
    for (var j = 0; j < gameGrid.size; j++)
      if (gameGrid.cells[i][j] != null) {
        gridTileSum += gameGrid.cells[i][j].value;
        tileCount += 1;
      }

  return gridTileSum / tileCount;
}

Grid.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
Grid.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

Grid.prototype.clone = function () {

  var currentGrid = this;
  var newGrid = new Grid(currentGrid.size, null);

  for (var i = 0; i < currentGrid.size; i++)
    for (var j = 0; j < currentGrid.size; j++)
    {
      if (currentGrid.cells[i][j] === null)
        newGrid.cells[i][j] = null;
      else
        newGrid.cells[i][j] = new Tile({x: currentGrid.cells[i][j].x, 
                                        y: currentGrid.cells[i][j].y}, 
                                      currentGrid.cells[i][j].value);
    }

  return newGrid;
}

Grid.prototype.printGrid = function () {
  console.log("printing grid");
  var self = this;
  var g = "";
  for (var i = 0; i < self.size; i++)
  {
    for (var j = 0; j < self.size; j++)
    {
      if (self.cells[j][i] === null)
        g += "0 ";
      else
        g += self.cells[j][i].value + " ";
    }
    g += "\n";
  }

    console.log(g);
}

move = ["up", "right", "down", "left"];

Grid.prototype.findFarthestPosition = function (cell, vector) {
  var previous;
  var self = this;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (self.withinBounds(cell) && self.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

Grid.prototype.moveTile = function (tile, cell) {

  this.cells[tile.x][tile.y] = null;
  this.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);

};

Grid.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};

Grid.prototype.move = function (direction) {

  var self = this;

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;


  self.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });

  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {

      cell = { x: x, y: y };
      tile = self.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          self.insertTile(merged);
          self.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);
        }
        else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  return moved;
}

var priority =     [[ 6,  5,  4,  1],
                    [ 5,  4,  1,  0],
                    [ 4,  1,  0, -1],
                    [ 1,  0, -1, -2]];

// var priority =     [[ 16,  15,  14,  13],
//                     [ 9, 10, 11,  12],
//                     [ 8,  7,  6, 5],
//                     [ 1, 2, 3 ,4]];

Grid.prototype.getScore = function() {

  var self = this;
  var score = 0;

  this.eachCell(function(x, y, tile) {
    if (tile)
      score += (priority[x][y] * tile.value * tile.value);
  });

  var penalty = 0;
  // var directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  var directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

  this.eachCell(function(x, y, tile) {
    if (tile)
    {
      for (var i = 0; i < 4; i ++)
      {
        var pos = {"x" : x + directions[i][0], "y" : y + directions[i][1]};

        if (self.withinBounds(pos))
        {
          var neighbour = self.cells[pos["x"]][pos["y"]];
          if (neighbour)
            penalty += (Math.abs(neighbour.value - tile.value) * 1);
        }
      }
    }
  });

  return score - penalty;
}
