
var gridSize = 10;
var tiles = [];
var revealedTiles = 0;
var playing = true;

class Tile {
    constructor() {
        this.mined = false;
        this.revealed = false;
        this.flagged = false;
    }
}

for (var i = 0; i < gridSize * gridSize; ++i) {
    tiles.push(new Tile);
    $("<div id=" + i + " class=\"box\"></div>").appendTo("#gamebox");
}

var bombCount = 0;
while (bombCount < 12) {
    var bombSpot = Math.floor(Math.random() * 99);
    if (!tiles[bombSpot].mined) {
        tiles[bombSpot].mined = true;
        ++bombCount;
    }
}

// reveals the clicked tile given boxNumber which is the id of the box, n is the number of adjacent mines
function reveal(boxNumber, adjMines) {
    $("#" + boxNumber).css("background-color", "lightgray");
    tiles[boxNumber].revealed = true;
    $("#" + boxNumber).text(adjMines);
    ++revealedTiles;
    if ((gridSize * gridSize) - revealedTiles == bombCount) {
        playing = false;
        $("#welcome").text("Congratulations you won!");
        $("#gamebox").fadeOut();
        $("#statusBar").fadeOut();
    }
}

function revealBombs() {
    var size = gridSize * gridSize;
    for (var i = 0; i < size; ++i) {
        if (tiles[i].mined && !tiles[i].revealed) {
            if (tiles[i].flagged) {
                $("#flag" + i).hide();
            }
            $("#" + i).css("background-color", "lightgray");
            $("<img src=\"bomb.png\"/>").appendTo("#" + i);
            tiles[i].revealed = true;
        }
    }
}

function findAdjMines(boxNumber) {
    var adjMines = 0;
    if (!tiles[boxNumber].revealed && !tiles[boxNumber].flagged) {
        for (var i = -1; i < 2; ++i) {
            for (var j = -1; j < 2; ++j) {
                if (i || j) {
                    if (Math.floor((boxNumber + i) / 10) == Math.floor(boxNumber / 10) &&
                        (boxNumber + (10 * j) < 100) && (boxNumber + (10 * j) >= 0)) {
                        if (tiles[boxNumber + i + (10 * j)].mined) {
                            ++adjMines;
                        }
                    }
                }
            }
        }
    }
    if (!adjMines) {
        adjReveal(boxNumber);
    } else {
        reveal(boxNumber, adjMines);
    }
}
    
function adjReveal(boxNumber) {
    reveal(boxNumber, 0);
    for (var i = -1; i < 2; ++i) {
        for (var j = -1; j < 2; ++j) {
            if (i || j) {
                if (Math.floor((boxNumber + i) / 10) == Math.floor(boxNumber / 10) &&
                    (boxNumber + (10 * j) < 100) && (boxNumber + (10 * j) >= 0)) {
                    if (!tiles[boxNumber + i + (10 * j)].revealed) {
                        findAdjMines(boxNumber + i + (10 * j));
                    }
                }
            }
        }
    }
}

// when you click a box
$(".box").mousedown(function (event) {
    var boxNumber = parseInt($(this).attr("id"));
    var currBox = tiles[boxNumber];
    if (playing) {
        if (!currBox.flagged) {
            if (currBox.mined && !currBox.revealed && event.which == 1) { // if mined and not revealed
                playing = false;
                $("#welcome").text("You clicked on a bomb! You lose!");
                $("#" + boxNumber).css("background-color", "lightgray");
                $("<img src=\"bomb.png\"/>").appendTo("#" + boxNumber);
                currBox.revealed = true;
                revealBombs();
                $("#statusBar").fadeOut(3000);
                $("#gamebox").fadeOut(3000);
            } else if (!currBox.revealed && event.which == 3) { // if not revealed and right clicked
                $("<img id=\"flag" + boxNumber + "\" src=\"flag.png\"/>").appendTo("#" + boxNumber);
                currBox.flagged = true;
            } else if (!currBox.revealed && event.which == 1) { // if not revealed and left clicked
                findAdjMines(boxNumber);
            }
        } else if (currBox.flagged && event.which == 3) {
            $("#flag" + boxNumber).hide();
            currBox.flagged = false;
        }
    }
});