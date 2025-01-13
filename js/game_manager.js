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
    var value = Math.random() < 0.999975 ? Math.random() < 0.999999999 ? Math.random() < 0.99999999 ? Math.random() < 0.9999999875 ? Math.random() < 0.999999975 ? Math.random() < 0.9999999615384615384615384 ? Math.random() < 0.99999996 ? Math.random() < 0.99999995 ? Math.random() < 0.9999999375 ? Math.random() < 0.999999875 ? Math.random() < 0.9999998 ? Math.random() < 0.99999975 ? Math.random() < 0.9999995 ? Math.random() < 0.999999 ? Math.random() < 0.999998958333333333333333333 ? Math.random() < 0.9999986111111111111111111 ? Math.random() < 0.999998333333333333333333 ? Math.random() < 0.99999791666666666666666666 ? Math.random() < 0.99999666666666666666666 ? Math.random() < 0.9999958333333333333333333 ? Math.random() < 0.99999333333333333333333 ? Math.random() < 0.999991666666666666666666 ? Math.random() < 0.99999 ? Math.random() < 0.99998666666666666666666 ? Math.random() < 0.999984375 ? Math.random() < 0.99998 ? Math.random() < 0.99996875 ? Math.random() < 0.999958333333333333333333 ? Math.random() < 0.9999375 ? Math.random() < 0.99991666666666666666666 ? Math.random() < 0.9999 ? Math.random() < 0.9998333333333333333333 ? Math.random() < 0.999666666666666666666 ? Math.random() < 0.9984375 ? 1 : 2 : 3 : 4 : Math.random() < 0.999999 ? Math.random() < 0.9998 ? Math.random() < 0.98 ? -2 : -6 : -10 : -12 : 5 : 6 : 7 : 8 : Math.random() < 0.999999 ? Math.random() < 0.9998 ? Math.random() < 0.98 ? -5 : -9 : -11 : -13 : 9 : 10 : 11 : 12 : 13 : 14 : 15 : 16 : 17 : 18 : 19 : 20 : 21 : 22 : Math.random() < 0.5 ? -7 : -8 : 23 : -4 : -3 : 82 : 83 : 24 : 25 : 30 : -1 : Math.random() < 0.5 ? "A" : Math.random() < 0.5 ? "B" : Math.random() < 0.5 ? "C" : Math.random() < 0.5 ? "D" : Math.random() < 0.5 ? "E" : Math.random() < 0.5 ? "F" : Math.random() < 0.5 ? "G" : Math.random() < 0.5 ? "H" : Math.random() < 0.5 ? "I" : Math.random() < 0.5 ? "J" : Math.random() < 0.5 ? "K" : Math.random() < 0.5 ? "L" : Math.random() < 0.5 ? "M" : Math.random() < 0.5 ? "N" : Math.random() < 0.5 ? "O" : Math.random() < 0.5 ? "P" : Math.random() < 0.5 ? "Q" : Math.random() < 0.5 ? "R" : Math.random() < 0.5 ? "S" : Math.random() < 0.5 ? "T" : Math.random() < 0.5 ? "U" : Math.random() < 0.5 ? "V" : Math.random() < 0.5 ? "W" : Math.random() < 0.5 ? "X" : Math.random() < 0.5 ? "Y" : "Z"; 
    var tile = new Tile(this.grid.randomAvailableCell(), value);
    
    this.grid.insertTile(tile);
    this.score += 1;
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

          // The mighty 23 tile
          if (merged.value === 23) self.won = true;
          if (merged.value === 24) self.over = true;
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


