function rand(max) {
	return Math.floor(Math.random() * max);
}

// 这个函数用于打乱数组a的顺序。它使用了Fisher-Yates算法，也被称为Knuth洗牌算法
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}


function changeBrightness(factor, sprite) {
	var virtCanvas = document.createElement("canvas");
	virtCanvas.width = 500;
	virtCanvas.height = 500;
	var context = virtCanvas.getContext("2d");
	context.drawImage(sprite, 0, 0, 500, 500);

	var imgData = context.getImageData(0, 0, 500, 500);

	for (let i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = imgData.data[i] * factor;
		imgData.data[i + 1] = imgData.data[i + 1] * factor;
		imgData.data[i + 2] = imgData.data[i + 2] * factor;
	}
	context.putImageData(imgData, 0, 0);

	var spriteOutput = new Image();
	spriteOutput.src = virtCanvas.toDataURL();
	virtCanvas.remove();
	return spriteOutput;
}

function toggleVisablity(id) {
	if (document.getElementById(id).style.visibility == "visible") {
		document.getElementById(id).style.visibility = "hidden";
	} else {
		document.getElementById(id).style.visibility = "visible";
	}
}


function Maze(Width, Height) {
	var mazeMap; 
	var width = Width;
	var height = Height;
	var startCoord, endCoord; 
	var dirs = ["n", "s", "e", "w"]; 
	var modDir = {
		
		n: {
			y: -1,
			x: 0,
			o: "s",
		},
		s: {
			y: 1,
			x: 0,
			o: "n",
		},
		e: {
			y: 0,
			x: 1,
			o: "w",
		},
		w: {
			y: 0,
			x: -1,
			o: "e",
		},
	};

	this.map = function () {
		return mazeMap;
	};
	this.startCoord = function () {
		return startCoord;
	};
	this.endCoord = function () {
		return endCoord;
	};

	
	function genMap() {
		mazeMap = new Array(height);
		for (y = 0; y < height; y++) {
			mazeMap[y] = new Array(width);
			for (x = 0; x < width; ++x) {
				mazeMap[y][x] = {
					n: false,
					s: false,
					e: false,
					w: false, 
					visited: false,
					priorPos: null, 
				};
			}
		}
	}

	
	function defineMaze() {
		var isComp = false;
		var move = false;
		var cellsVisited = 1;
		var numLoops = 0;
		var maxLoops = 0;
		var pos = {
			x: 0,
			y: 0,
		};
		var numCells = width * height;
		while (!isComp) {
			move = false;
			mazeMap[pos.x][pos.y].visited = true;

			if (numLoops >= maxLoops) {
				shuffle(dirs);
				maxLoops = Math.round(rand(height / 8));
				numLoops = 0;
			}
			numLoops++;
			for (index = 0; index < dirs.length; index++) {
				var direction = dirs[index];
				var nx = pos.x + modDir[direction].x;
				var ny = pos.y + modDir[direction].y;

				if (nx >= 0 && nx < width && ny >= 0 && ny < height) {

					if (!mazeMap[nx][ny].visited) {
						
						mazeMap[pos.x][pos.y][direction] = true;
						mazeMap[nx][ny][modDir[direction].o] = true;

					
						mazeMap[nx][ny].priorPos = pos;
					
						pos = {
							x: nx,
							y: ny,
						};
						cellsVisited++;
						
						move = true;
						break;
					}
				}
			}

			if (!move) {

				pos = mazeMap[pos.x][pos.y].priorPos;
			}
			if (numCells == cellsVisited) {
				isComp = true;
			}
		}
	}

	
	function defineStartEnd() {
		switch (rand(4)) {
			case 0:
				startCoord = {
					x: 0,
					y: 0,
				};
				endCoord = {
					x: height - 1,
					y: width - 1,
				};
				break;
			case 1:
				startCoord = {
					x: 0,
					y: width - 1,
				};
				endCoord = {
					x: height - 1,
					y: 0,
				};
				break;
			case 2:
				startCoord = {
					x: height - 1,
					y: 0,
				};
				endCoord = {
					x: 0,
					y: width - 1,
				};
				break;
			case 3:
				startCoord = {
					x: height - 1,
					y: width - 1,
				};
				endCoord = {
					x: 0,
					y: 0,
				};
				break;
		}
	}

	genMap();
	defineStartEnd();
	defineMaze();
}


function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
	var map = Maze.map();
	var cellSize = cellsize;
	var drawEndMethod;
	ctx.lineWidth = cellSize / 40;

	this.fog = false;

	
	this.enableFog = function () {
		this.fog = true;
		document.getElementById("fogOn").play();
	};

	
	this.disableFog = function () {
		this.fog = false;
		document.getElementById("fogOff").play();
	};

	
	this.drawFog = function (playerCoords) {

		drawMap();
		
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);


		var visibleRadius = cellSize * Math.round(map.length * 0.12);

	
		var gradient = ctx.createRadialGradient(
			(playerCoords.x + 0.5) * cellSize,
			(playerCoords.y + 0.5) * cellSize,
			0,
			(playerCoords.x + 0.5) * cellSize,
			(playerCoords.y + 0.5) * cellSize,
			visibleRadius
		);
		/*gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
		gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");*/
		gradient.addColorStop(0.65, "rgba(0, 0, 0, 0.5)");
		gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)"); 

		
		ctx.globalCompositeOperation = "destination-out";
		ctx.fillStyle = gradient;

		ctx.beginPath();
		ctx.arc(
			(playerCoords.x + 0.5) * cellSize,
			(playerCoords.y + 0.5) * cellSize,
			visibleRadius,
			0,
			2 * Math.PI
		);
		ctx.fill();

		
		var endCoords = maze.endCoord();
		ctx.beginPath();
		ctx.arc(
			(endCoords.x + 0.5) * cellSize,
			(endCoords.y + 0.5) * cellSize,
			visibleRadius,
			0,
			2 * Math.PI
		);
		ctx.fill();

		if (endSprite) {
			drawEndSprite();
		}
		
		ctx.globalCompositeOperation = "source-over";
	};

	
	this.redrawMaze = function (size) {
		cellSize = size;
		ctx.lineWidth = cellSize / 50;
		drawMap();
		drawEndMethod();
		
		if (this.fog) {
			this.drawFog(player.cellCoords);
		}
	};

	
	function drawCell(xCord, yCord, cell) {
		var x = xCord * cellSize;
		var y = yCord * cellSize;

		ctx.strokeStyle = "black"; 

		if (cell.n == false) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + cellSize, y);
			ctx.stroke();
		}
		if (cell.s === false) {
			ctx.beginPath();
			ctx.moveTo(x, y + cellSize);
			ctx.lineTo(x + cellSize, y + cellSize);
			ctx.stroke();
		}
		if (cell.e === false) {
			ctx.beginPath();
			ctx.moveTo(x + cellSize, y);
			ctx.lineTo(x + cellSize, y + cellSize);
			ctx.stroke();
		}
		if (cell.w === false) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x, y + cellSize);
			ctx.stroke();
		}
	}

	// 绘制整个迷宫
	function drawMap() {
		for (x = 0; x < map.length; x++) {
			for (y = 0; y < map[x].length; y++) {
				drawCell(x, y, map[x][y]);
			}
		}
	}

	// 绘制终点的标志
	function drawEndFlag() {
		var coord = Maze.endCoord();
		var gridSize = 4;
		var fraction = cellSize / gridSize - 2;
		var colorSwap = true;
		for (let y = 0; y < gridSize; y++) {
			if (gridSize % 2 == 0) {
				colorSwap = !colorSwap;
			}
			for (let x = 0; x < gridSize; x++) {
				ctx.beginPath();
				ctx.rect(
					coord.x * cellSize + x * fraction + 4.5,
					coord.y * cellSize + y * fraction + 4.5,
					fraction,
					fraction
				);
				if (colorSwap) {
					ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
				} else {
					ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				}
				ctx.fill();
				colorSwap = !colorSwap;
			}
		}
	}

	// 绘制终点的图像
	function drawEndSprite() {
		var offsetLeft = cellSize / 50;
		var offsetRight = cellSize / 25;
		var coord = Maze.endCoord();
		ctx.drawImage(
			endSprite,
			2,
			2,
			endSprite.width,
			endSprite.height,
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
	}

	// 清除canvas
	function clear() {
		var canvasSize = cellSize * map.length;
		ctx.clearRect(0, 0, canvasSize, canvasSize);
	}

	// 如果没有终点图像，则绘制默认的标志
	if (endSprite != null) {
		drawEndMethod = drawEndSprite;
	} else {
		drawEndMethod = drawEndFlag;
	}
	clear();
	drawMap();
	drawEndMethod();
}

// ------------------------------------------------------------------ 在迷宫中创建和控制一个玩家
function Player(maze, c, _cellsize, onComplete, sprite = null) {
	var ctx = c.getContext("2d");
	var drawSprite;
	var moves = 0;
	drawSprite = drawSpriteCircle;
	if (sprite != null) {
		drawSprite = drawSpriteImg;
	}
	var player = this;
	var map = maze.map();
	var cellCoords = {
		x: maze.startCoord().x,
		y: maze.startCoord().y,
	};
	var cellSize = _cellsize;
	var halfCellSize = cellSize / 2;

	// 重新绘制玩家
	this.redrawPlayer = function (_cellsize) {
		cellSize = _cellsize;
		drawSpriteImg(cellCoords);
	};

	this.startTime = performance.now(); // 在这里设置startTime

	// 默认绘制一个圆形的玩家
	function drawSpriteCircle(coord) {
		ctx.beginPath();
		ctx.fillStyle = "yellow";
		ctx.arc(
			(coord.x + 1) * cellSize - halfCellSize,
			(coord.y + 1) * cellSize - halfCellSize,
			halfCellSize - 2,
			0,
			2 * Math.PI
		);
		ctx.fill();
		if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
			onComplete(moves);
			player.unbindKeyDown();
		}
	}

	// 绘制一个图像的玩家
	function drawSpriteImg(coord) {
		var offsetLeft = cellSize / 50;
		var offsetRight = cellSize / 25;
		ctx.drawImage(
			sprite,
			0,
			0,
			sprite.width,
			sprite.height,
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
		if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
			onComplete(moves);
			player.unbindKeyDown();
		}
	}

	// 移除玩家的图像
	function removeSprite(coord) {
		var offsetLeft = cellSize / 50;
		var offsetRight = cellSize / 25;
		ctx.clearRect(
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
	}

	// ---------------------------------------------- 检查玩家的移动，只有当玩家真正移动时，才增加步数
	function check(e) {
		var cell = map[cellCoords.x][cellCoords.y];
		var moved = false;
		switch (e.keyCode) {
			case 65:
			case 37: // west
				if (cell.w == true) {
					moves++;
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x - 1,
						y: cellCoords.y,
					};
					drawSprite(cellCoords);
					moved = true;
				}
				break;
			case 87:
			case 38: // north
				if (cell.n == true) {
					moves++;
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x,
						y: cellCoords.y - 1,
					};
					drawSprite(cellCoords);
					moved = true;
				}
				break;
			case 68:
			case 39: // east
				if (cell.e == true) {
					moves++;
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x + 1,
						y: cellCoords.y,
					};
					drawSprite(cellCoords);
					moved = true;
				}
				break;
			case 83:
			case 40: // south
				if (cell.s == true) {
					moves++;
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x,
						y: cellCoords.y + 1,
					};
					drawSprite(cellCoords);
					moved = true;
				}
				break;
		}
		// 调用绘制Fog的方法
		if (draw.fog) {
			draw.drawFog(cellCoords);
		}
		if (!moved) {
			document.getElementById("wall").play();
		}
	}

	
	this.bindKeyDown = function () {
		window.addEventListener("keydown", check, false);

		$("#view").swipe({
			swipe: function (
				event,
				direction,
				distance,
				duration,
				fingerCount,
				fingerData
			) {
				console.log(direction);
				switch (direction) {
					case "up":
						check({
							keyCode: 38,
						});
						break;
					case "down":
						check({
							keyCode: 40,
						});
						break;
					case "left":
						check({
							keyCode: 37,
						});
						break;
					case "right":
						check({
							keyCode: 39,
						});
						break;
				}
			},
			threshold: 0,
		});
	};

	
	this.unbindKeyDown = function () {
		window.removeEventListener("keydown", check, false);
		$("#view").swipe("destroy");
	};

	drawSprite(maze.startCoord());

	this.bindKeyDown();
}


var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite; 
var finishSprite; 
var maze, draw, player;
var cellSize; 
var difficulty;
// sprite.src = 'media/sprite.png';

window.onload = function () {
	let viewWidth = $("#view").width();
	let viewHeight = $("#view").height();
	if (viewHeight < viewWidth) {
		ctx.canvas.width = viewHeight - viewHeight / 100;
		ctx.canvas.height = viewHeight - viewHeight / 100;
	} else {
		ctx.canvas.width = viewWidth - viewWidth / 100;
		ctx.canvas.height = viewWidth - viewWidth / 100;
	}

	var completeOne = false;
	var completeTwo = false;
	var isComplete = () => {
		if (completeOne === true && completeTwo === true) {
			console.log("Runs");
			setTimeout(function () {
				makeMaze();
			}, 500);
		}
	};
	sprite = new Image();
	sprite.src =
		"https://i.ibb.co/c8DnVSG/1-12-icon-icons-com-68880.png" +
		"?" +
		new Date().getTime();
	sprite.setAttribute("crossOrigin", " ");
	sprite.onload = function () {
		sprite = changeBrightness(1.2, sprite);
		completeOne = true;
		console.log(completeOne);
		isComplete();
	};

	finishSprite = new Image();
	finishSprite.src =
		"https://i.ibb.co/g7p9R1c/door-icon-126434.png" +
		"?" +
		new Date().getTime();
	finishSprite.setAttribute("crossOrigin", " ");
	finishSprite.onload = function () {
		finishSprite = changeBrightness(1.1, finishSprite);
		completeTwo = true;
		console.log(completeTwo);
		isComplete();
	};
};

window.onresize = function () {
	let viewWidth = $("#view").width();
	let viewHeight = $("#view").height();
	if (viewHeight < viewWidth) {
		ctx.canvas.width = viewHeight - viewHeight / 100;
		ctx.canvas.height = viewHeight - viewHeight / 100;
	} else {
		ctx.canvas.width = viewWidth - viewWidth / 100;
		ctx.canvas.height = viewWidth - viewWidth / 100;
	}
	cellSize = mazeCanvas.width / difficulty;
	if (player != null) {
		draw.redrawMaze(cellSize);
		player.redrawPlayer(cellSize);
	}
};


document.getElementById("diffSelect").addEventListener("change", function () {
	if (this.value === "custom") {
		document.getElementById("customInput").style.visibility = "visible";
	} else {
		document.getElementById("customInput").style.visibility = "hidden";
	}
});

function makeMaze() {
	if (player != undefined) {
		player.unbindKeyDown();
		player = null;
	}
	var e = document.getElementById("diffSelect");
	var difficulty =
		e.value === "custom"
			? document.getElementById("customInput").value
			: e.options[e.selectedIndex].value;
	cellSize = mazeCanvas.width / difficulty;
	maze = new Maze(difficulty, difficulty);
	draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
	player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
	if (document.getElementById("mazeContainer").style.opacity < "100") {
		document.getElementById("mazeContainer").style.opacity = "100";
	}
	
	if (document.getElementById("fogCheckbox").checked) {
		draw.enableFog();
	} else {
		draw.disableFog();
	}

	function calculateScore(steps, time, minSteps, maxSteps, maxTime) {
		var score = 100 * (1 - (steps - minSteps) / maxSteps - time / maxTime);
		return Math.max(0, score.toFixed(2));
	}

	
	function displayVictoryMess(moves) {
		var endTime = performance.now();
		var timeElapsed = ((endTime - player.startTime) / 1000).toFixed(2); 
		var fogMode = document.getElementById("fogCheckbox").checked; 
		function findShortestPath(maze) {
			var startCoord = maze.startCoord();
			var endCoord = maze.endCoord();
			var queue = [startCoord];
			var visited = new Set();
			var distance = {};
			var key = (coord) => coord.x + "," + coord.y;

			distance[key(startCoord)] = 0;

			while (queue.length > 0) {
				var current = queue.shift();
				var currentKey = key(current);

				if (current.x === endCoord.x && current.y === endCoord.y) {
					return distance[currentKey];
				}

				for (var direction of ["n", "s", "e", "w"]) {
					if (maze.map()[current.x][current.y][direction]) {
						var next = {
							x:
								current.x +
								(direction === "e" ? 1 : direction === "w" ? -1 : 0),
							y:
								current.y +
								(direction === "s" ? 1 : direction === "n" ? -1 : 0),
						};
						var nextKey = key(next);

						if (!visited.has(nextKey)) {
							queue.push(next);
							visited.add(nextKey);
							distance[nextKey] = distance[currentKey] + 1;
						}
					}
				}
			}
			
			return Infinity;
		}

		
		var minSteps = findShortestPath(maze);

		var originalMinSteps = minSteps;

		
		if (fogMode) {
			var factor = Math.pow(1.01, difficulty);
			minSteps *= factor;
		}

		var maxSteps = difficulty * difficulty; 
		var maxTime = maxSteps * 2;

		if (isMobileDevice()) {
			
			maxTime = maxSteps * 5;
		}
		var score = calculateScore(moves, timeElapsed, minSteps, maxSteps, maxTime);
		document.getElementById("moves").innerHTML =
			"You Moved <b>" +
			moves +
			"</b> Steps. <br /> Minimum Possible Steps: <b>" +
			originalMinSteps +
			"</b><br /> Spent Time : <b>" +
			timeElapsed +
			"</b> s. <br /> Your Score: <b>" +
			score;

		toggleVisablity("Message-Container");
		document.getElementById("victory").play();
	}

	document.getElementById("moves").className = "score";
}


document.getElementById("fogCheckbox").addEventListener("change", function () {
	if (this.checked) {
		draw.enableFog();
	} else {
		draw.disableFog();
	}
});


function isMobileDevice() {
	
	var hasTouchScreen = false;
	if ("maxTouchPoints" in navigator) {
		hasTouchScreen = navigator.maxTouchPoints > 0;
	} else if ("msMaxTouchPoints" in navigator) {
		hasTouchScreen = navigator.msMaxTouchPoints > 0;
	} else {
		var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
		if (mQ && mQ.media === "(pointer:coarse)") {
			hasTouchScreen = !!mQ.matches;
		} else if ("orientation" in window) {
			hasTouchScreen = true; 
		} else {
			
			var ua = navigator.userAgent;
			var regex =
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
			hasTouchScreen = regex.test(ua);
		}
	}
	return hasTouchScreen;
}
