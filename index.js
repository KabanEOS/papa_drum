var isPlaying = false;
var tiles = [];
var tempoGlobal = 120;
var tempoGlobalSec;
var tempoColumn = 0;
var keyLines = [];
var accessKeys = [];
var Tile = /** @class */ (function () {
    function Tile(pos, state, accessKeys) {
        this.state = state;
        this.pos = pos;
        this.accessKeys = accessKeys;
    }
    Tile.prototype.getLinePos = function () {
        var line;
        if (this.pos != "") {
            line = this.pos.charAt(0);
        }
        return line;
    };
    Tile.prototype.getColPos = function () {
        var col;
        if (this.pos != "") {
            if (this.pos.charAt(2) != "") {
                col = this.pos.charAt(1).concat(this.pos.charAt(2));
            }
            else {
                col = this.pos.charAt(1);
            }
        }
        return col;
    };
    Tile.prototype.getPos = function () {
        return this.pos;
    };
    Tile.prototype.getState = function () {
        return this.state;
    };
    Tile.prototype.getAccessKey = function () {
        return this.accessKeys;
    };
    return Tile;
}());
appStart();
function appStart() {
    gridIdGenerator();
    setTempo();
    playDemo();
    playSoundAuto();
}
function gridIdGenerator() {
    keyLines = [
        "q",
        "w",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "a",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
    ];
    accessKeys = [
        "81",
        "87",
        "69",
        "82",
        "84",
        "89",
        "85",
        "73",
        "65",
        "83",
        "68",
        "70",
        "71",
        "72",
        "74",
        "75",
    ];
    var gridContainer = document.querySelector(".gridContainer");
    for (var j = 0; j < keyLines.length; j++) {
        var currentAccessKey = accessKeys[j];
        for (var i = 0; i < 16; i++) {
            var result = keyLines[j] + i; // take all possible 250+ combination of v - h pos
            tiles.push(new Tile(result, false, currentAccessKey)); // push all to array of objects
        }
    }
    for (var k = 0; k < tiles.length; k++) {
        // read array of obj and create div tiles with their own properties
        var pos = tiles[k].getPos();
        var accessKey = tiles[k].getAccessKey();
        var state = tiles[k].getState();
        gridContainer.innerHTML +=
            '<div id="' +
                tiles[k].pos +
                '" accessKey="' +
                accessKey +
                '" isActive= "' +
                state +
                '" pos="' +
                pos +
                '" onclick = "handleClick(event)"></div>';
    }
}
function handleClick(e) {
    // handle click internally in ts structures and change attributes in HTML by functions setColor, setState
    var response = e.target.id; // currently clicked tile, click event handle and transfer
    for (var k = 0; k < tiles.length; k++) {
        var pos = tiles[k].getPos();
        if (pos == response) {
            if (tiles[k].state != true) {
                tiles[k].state = true;
                setColor(response, true);
                setState(response, true);
            }
            else {
                tiles[k].state = false;
                setColor(response, false);
                setState(response, false);
            }
        }
    }
}
function setColor(pos, isRed) {
    // TODO priority low - toggling color by this function make hover inactive after each use on each clicked tile
    var tile = document.getElementById("" + pos);
    if (isRed) {
        tile.style.background = "rgba(207, 50, 50, 0.906)";
    }
    else {
        tile.style.background = "rgba(129, 89, 204, 0.87)";
    }
}
function setState(pos, isActive) {
    // changes internal attribute of state named isActive
    var tile = document.getElementById("" + pos);
    if (isActive) {
        tile.setAttribute("isActive", "true");
    }
    else {
        console.log("wtf");
        tile.setAttribute("isActive", "false");
    }
}
function playSoundByKey(audio, key) {
    // final function in action chain that actually trigger - play the sound
    if (!audio)
        return;
    audio.currentTime = 0;
    audio.play();
    key.classList.add("playing");
}
function playDemo() {
    // function that play the sound while named "demo" tile is being clicked
    var titleNodes = document.querySelector("#gridTitleContainer").children;
    var tileDemo;
    var _loop_1 = function (i) {
        var currentTitleNodeAccessKey = titleNodes[i].accessKey;
        var currentTitleNode = titleNodes[i];
        key = "";
        currentTitleNode.addEventListener("click", playNode);
        function playNode() {
            var audio = document.querySelector("audio[data-key=\"" + currentTitleNodeAccessKey + "\"]");
            key = document.querySelector(".key[data-key=\"" + currentTitleNodeAccessKey + "\"]");
            playSoundByKey(audio, key);
            var tileDemo = currentTitleNode.firstElementChild;
            tileDemo.style.background = "rgb(247, 222, 6)";
            setTimeout(function () {
                tileDemo.style.background = "rgb(68, 196, 247)";
            }, 250);
        }
    };
    var key;
    for (var i = 0; i < titleNodes.length; i++) {
        _loop_1(i);
    }
    window.addEventListener("keydown", function (e) {
        var audio = document.querySelector("audio[data-key=\"" + e.keyCode + "\"]");
        key = document.querySelector(".key[data-key=\"" + e.keyCode + "\"]");
        playSoundByKey(audio, key);
        // add color to .keyName on keydown 
    });
    // logic to trigger sound even if clicked again faster than sound duration
    function removeTransition(e) {
        var _this = this;
        if (e.propertyName !== "transform")
            return;
        setTimeout(function () {
            _this.classList.remove("playing");
        }, 1700);
    }
    var keys = document.querySelectorAll(".key");
    keys.forEach(function (key) {
        return key.addEventListener("transitionend", removeTransition);
    });
}
// function colorTile():void {
//   let titleNodes = document.querySelector("#gridTitleContainer").children;
// }
// function colorTileOnDemo(color, key) {
//   // final function in action chain that actually trigger - play the sound
//   if (!color) return;
//   color.currentTime = 0;
//   // color.play();
//   key.style.background("rgb(247, 222, 6)");
// }
var box = document.querySelector(".playPause"); // part of play pause transition animation logic
box.addEventListener("click", function (e) {
    e.target.classList.toggle("pause");
});
function setTempo() {
    document.getElementById("tempoUp").addEventListener("click", tempoUp);
    document.getElementById("tempoDown").addEventListener("click", tempoDown);
    function tempoUp() {
        tempoGlobal += 10;
        setTempo(tempoGlobal);
        tempoGlobalSec = 60000 / tempoGlobal;
    }
    function tempoDown() {
        tempoGlobal -= 10;
        setTempo(tempoGlobal);
        tempoGlobalSec = 60000 / tempoGlobal;
    }
    function setTempo(tempoGlobal) {
        document.getElementById("tempoValue").innerHTML = tempoGlobal;
    }
}
function playPause() {
    if (!isPlaying)
        isPlaying = true;
    else
        isPlaying = false;
    playSoundAuto();
}
function playSoundAuto() {
    // TODO priority high
    // document.getElementById("stopBtn").addEventListener("click", playPause); // when clicked - reset color to basic (with active red) and clear ranTimes state to initial
    document.getElementById("playPause").addEventListener("click", playPause);
    var ranTimes = 16;
    if (isPlaying) {
        var interval = (60 / tempoGlobal) * 1000;
        var myTimeout = setInterval(function () {
            tempoColumn = Math.abs(ranTimes - 16);
            playInterval();
            ranTimes--;
            if (ranTimes == 0 && isPlaying) {
                ranTimes = 16;
            }
            else if (ranTimes == 0 || !isPlaying) {
                ranTimes = 0;
                clearInterval(myTimeout);
            }
        }, interval);
    }
}
function playInterval() {
    for (var k = 0; k < tiles.length; k++) {
        // loop over array of all tiles
        if (tiles[k].getColPos() == tempoColumn) {
            // if current tile column position is equal to global tempo
            var currentPos = tiles[k].getPos();
            var tile = document.getElementById(currentPos);
            var accessKey = tile.getAttribute("accessKey");
            var state = tile.getAttribute("isactive");
            if (state == "true") {
                var pos = tile.getAttribute("pos");
                var audio = document.querySelector("audio[data-key=\"" + accessKey + "\"]");
                var key = document.querySelector(".key[data-key=\"" + accessKey + "\"]");
                playSoundByKey(audio, key);
            }
            tile.style.background = "rgb(247, 222, 6)";
        }
        if (tiles[k].getColPos() == tempoColumn - 1) {
            var currentCol = tiles[k].getColPos();
            var currentPos = tiles[k].getPos();
            var tile = document.getElementById(currentPos);
            tile.style.background = "rgba(129, 89, 204, 0.87)";
            var state = tile.getAttribute("isactive");
            if (state == "true") {
                var pos = tile.getAttribute("pos");
                setColor(pos, true);
            }
        }
        if (tiles[k].getColPos() == 15 && tempoColumn == 0) {
            var currentCol = tiles[k].getColPos();
            var currentPos = tiles[k].getPos();
            var tile = document.getElementById(currentPos);
            tile.style.background = "rgba(129, 89, 204, 0.87)";
            var state = tile.getAttribute("isactive");
            if (state == "true") {
                var pos = tile.getAttribute("pos");
                setColor(pos, true);
            }
        }
    }
}
