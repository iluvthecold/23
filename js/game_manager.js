function GameManager(size, InputManager, Actuator, ScoreManager) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.scoreManager = new ScoreManager;
  this.actuator     = new Actuator;

  this.startTiles   = 1;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.actuator.continue();
  this.setup();
};

// Keep playing after winning
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continue();
};

GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};

// Set up the game
GameManager.prototype.setup = function () {
  this.grid        = new Grid(this.size);

  this.score       = 0;
  this.over        = false;
  this.won         = false;
  this.keepPlaying = false;

  // Add the initial tiles
  this.addStartTiles();

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.99996 ? Math.random() < 0.9999999998 ? Math.random() < 0.99999999 ? Math.random() < 0.9999999888888888888888888 ? Math.random() < 0.9999999875 ? Math.random() < 0.9999999857142857142857142 ? Math.random() < 0.999999984375 ? Math.random() < 0.9999999814814814814814814 ? Math.random() < 0.99999998 ? Math.random() < 0.999999975 ? Math.random() < 0.99999996875 ? Math.random() < 0.99999996428571428571428571 ? Math.random() < 0.9999999615384615384615384 ? Math.random() < 0.99999996 ? Math.random() < 0.999999958333333333333333333 ? Math.random() < 0.9999999333333333333333333 ? Math.random() < 0.99999991666666666666666666 ? Math.random() < 0.9999998333333333333333333 ? Math.random() < 0.999999666666666666666666 ? Math.random() < 0.9999995 ? Math.random() < 0.999999 ? Math.random() < 0.999998 ? Math.random() < 0.99999652777777777777777777 ? Math.random() < 0.99999375 ? Math.random() < 0.9999930555555555555555555 ? Math.random() < 0.99999 ? Math.random() < 0.99998333333333333333333 ? Math.random() < 0.999975 ? Math.random() < 0.99995 ? Math.random() < 0.9999074074074074074074 ? Math.random() < 0.99986111111111111111111 ? Math.random() < 0.9995370370370370370370 ? Math.random() < 0.99814814814814814814 ? Math.random() < 0.999999999 ? 1 : "1➔" : Math.random() < 0.9 ? 2 : "2➔" : Math.random() < 0.9 ? 3 : "3➔" : Math.random() < 0.9 ? 4 : "4➔" : Math.random() < 0.9 ? 5 : "5➔" : Math.random() < 0.9 ? 6 : "6➔" : Math.random() < 0.9 ? 7 : "7➔" : Math.random() < 0.9 ? 8 : "8➔" : Math.random() < 0.9 ? 16 : "16➔" : Math.random() < 0.9 ? 9 : "9➔" : Math.random() < 0.99 ? Math.random() < 0.9 ? 17 : "17➔" : Math.random() < 0.9 ? 18 : "18➔" : Math.random() < 0.9 ? 10 : "10➔" : Math.random() < 0.9 ? 11 : "11➔" : Math.random() < 0.9 ? 12 : "12➔" : Math.random() < 0.9 ? 19 : "↿➔" : Math.random() < 0.9 ? 13 : "13➔" : Math.random() < 0.9 ? 14 : "14➔" : Math.random() < 0.9 ? 15 : "15➔" : Math.random() < 0.9 ? 43 : "43➔" : Math.random() < 0.9 ? 81 : "81➔" : Math.random() < 0.9 ? 82 : "82➔" : Math.random() < 0.9 ? 83 : "83➔" : Math.random() < 0.9 ? 84 : "84➔" : Math.random() < 0.9 ? 31 : "31➔" : Math.random() < 0.9 ? 97 : "97➔" : Math.random() < 0.9 ? -5 : "-5➔" : Math.random() < 0.9 ? 54 : "54➔" : Math.random() < 0.9 ? 76 : "76➔" : Math.random() < 0.9 ? 61 : "61➔" : Math.random() < 0.9 ? 62 : "62➔" : Math.random() < 0.9 ? -9 : "-9➔" : Math.random() < 0.9 ? 28 : "28➔" : 20 : Math.random() < 0.9 ? 0 : "0➔";
    var tile = new Tile(this.grid.randomAvailableCell(), value);

    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.scoreManager.get() < this.score) {
    this.scoreManager.set(this.score);
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.scoreManager.get(),
    terminated: this.isGameTerminated()
  });

};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2:down, 3: left
  var self = this;

  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
	var merged = new Tile(positions.next, tile.value * 1);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);

          // Converge the two tiles' positions
          tile.updatePosition(positions.next);

          // Update the score
          self.score += 1;

          // The mighty 2048 tile
          if (merged.value === 13) self.won = true;
	  if (merged.value === 14) self.over = true;
        } else {
          self.moveTile(tile, positions.farthest);
        }

        if (!self.positionsEqual(cell, tile)) {
          moved = true; // The tile moved from its original cell!
        }
      }
    });
  });

  if (moved) {
    this.addRandomTile();

    if (!this.movesAvailable()) {
      this.over = true; // Game over!
    }

    this.actuate();
  }
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // up
    1: { x: 1,  y: 0 },  // right
    2: { x: 0,  y: 1 },  // down
    3: { x: -1, y: 0 }   // left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
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

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;

  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value === tile.value) {
            return true; // These two tiles can be merged
          }
        }
      }
    }
  }

  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
