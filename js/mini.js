function GameManager(e,t,i,n){this.size=e,this.inputManager=new t,this.storageManager=new n,this.actuator=new i,this.startTiles=2,this.inputManager.on("restart",this.restart.bind(this)),this.inputManager.on("keepPlaying",this.keepPlaying.bind(this)),this.setup()}function Grid(e,t){this.size=e,this.cells=t?this.fromState(t):this.empty()}function HTMLActuator(){this.tileContainer=document.querySelector(".tile-container"),this.scoreContainer=document.querySelector(".score-container"),this.bestContainer=document.querySelector(".best-container"),this.messageContainer=document.querySelector(".game-message"),this.score=0}function KeyboardInputManager(){this.events={},window.navigator.msPointerEnabled?(this.eventTouchstart="MSPointerDown",this.eventTouchmove="MSPointerMove",this.eventTouchend="MSPointerUp"):(this.eventTouchstart="touchstart",this.eventTouchmove="touchmove",this.eventTouchend="touchend"),this.listen()}function LocalStorageManager(){this.bestScoreKey="bestScore",this.gameStateKey="gameState";var e=this.localStorageSupported();this.storage=e?window.localStorage:window.fakeStorage}function Tile(e,t){this.x=e.x,this.y=e.y,this.value=t||2,this.previousPosition=null,this.mergedFrom=null}!function(){for(var e=0,t=["webkit","moz"],i=0;i<t.length&&!window.requestAnimationFrame;++i)window.requestAnimationFrame=window[t[i]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[t[i]+"CancelAnimationFrame"]||window[t[i]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(t){var i=(new Date).getTime(),n=Math.max(0,16-(i-e)),r=window.setTimeout(function(){t(i+n)},n);return e=i+n,r}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)})}(),window.requestAnimationFrame(function(){function e(){setTimeout(function(){var i=0;if(i=t.grid.availableCells().length<4?6:4,t.move(t.getBestMove(t.grid,i))===!1)for(var n=0;4>n&&t.move(n)!==!0;n++);e()},50)}var t=new GameManager(4,KeyboardInputManager,HTMLActuator,LocalStorageManager);e()});var BOARD=1,PLAYER=0;GameManager.prototype.getBestMove=function(e,t){for(var i=Number.MIN_VALUE,n=0,r=0;4>r;r++){var o=e.clone();if(o.move(r)!==!1){var a=this.expectimax(o,t-1,BOARD);a>i&&(n=r,i=a)}}return n},GameManager.prototype.expectimax=function(e,t,i){var n=this;if(0==t)return e.getScore();if(i===PLAYER){for(var r=Number.MIN_VALUE,o=0;4>o;o++){var a=e.clone(),s=a.move(o);if(s!==!1){var l=this.expectimax(a,t-1,BOARD);l>r&&(r=l)}}return r}if(i===BOARD){for(var r=0,c=e.availableCells(),u=c.length,o=0;u>o;o++){var a=e.clone();a.insertTile(new Tile(c[o],4));var l=n.expectimax(a,t-1,PLAYER);r+=l===Number.MIN_VALUE?0:.1*l,a=e.clone(),a.insertTile(new Tile(c[o],2)),l=n.expectimax(a,t-1,PLAYER),r+=l===Number.MIN_VALUE?0:.9*l}return r/=u}},Function.prototype.bind=Function.prototype.bind||function(e){var t=this;return function(i){i instanceof Array||(i=[i]),t.apply(e,i)}},function(){function e(e){this.el=e;for(var t=e.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<t.length;i++)n.call(this,t[i])}function t(e,t,i){Object.defineProperty?Object.defineProperty(e,t,{get:i}):e.__defineGetter__(t,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,n=i.push,r=i.splice,o=i.join;e.prototype={add:function(e){this.contains(e)||(n.call(this,e),this.el.className=this.toString())},contains:function(e){return-1!=this.el.className.indexOf(e)},item:function(e){return this[e]||null},remove:function(e){if(this.contains(e)){for(var t=0;t<this.length&&this[t]!=e;t++);r.call(this,t,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(e){return this.contains(e)?this.remove(e):this.add(e),this.contains(e)}},window.DOMTokenList=e,t(HTMLElement.prototype,"classList",function(){return new e(this)})}}(),GameManager.prototype.restart=function(){this.storageManager.clearGameState(),this.actuator.continueGame(),this.setup()},GameManager.prototype.keepPlaying=function(){this.keepPlaying=!0,this.actuator.continueGame()},GameManager.prototype.isGameTerminated=function(){return this.over||this.won&&!this.keepPlaying},GameManager.prototype.setup=function(){var e=this.storageManager.getGameState();e?(this.grid=new Grid(e.grid.size,e.grid.cells),this.score=e.score,this.over=e.over,this.won=e.won,this.keepPlaying=e.keepPlaying):(this.grid=new Grid(this.size),this.score=0,this.over=!1,this.won=!1,this.keepPlaying=!1,this.addStartTiles()),this.actuate()},GameManager.prototype.addStartTiles=function(){for(var e=0;e<this.startTiles;e++)this.addRandomTile()},GameManager.prototype.addRandomTile=function(){if(this.grid.cellsAvailable()){var e=Math.random()<.9?2:4,t=new Tile(this.grid.randomAvailableCell(),e);this.grid.insertTile(t)}},GameManager.prototype.actuate=function(){this.storageManager.getBestScore()<this.score&&this.storageManager.setBestScore(this.score),this.over?this.storageManager.clearGameState():this.storageManager.setGameState(this.serialize()),this.actuator.actuate(this.grid,{score:this.score,over:this.over,won:this.won,bestScore:this.storageManager.getBestScore(),terminated:this.isGameTerminated()})},GameManager.prototype.serialize=function(){return{grid:this.grid.serialize(),score:this.score,over:this.over,won:this.won,keepPlaying:this.keepPlaying}},GameManager.prototype.prepareTiles=function(){this.grid.eachCell(function(e,t,i){i&&(i.mergedFrom=null,i.savePosition())})},GameManager.prototype.moveTile=function(e,t){this.grid.cells[e.x][e.y]=null,this.grid.cells[t.x][t.y]=e,e.updatePosition(t)},GameManager.prototype.move=function(e){var t=this;if(!this.isGameTerminated()){var i,n,r=this.getVector(e),o=this.buildTraversals(r),a=!1;return this.prepareTiles(),o.x.forEach(function(e){o.y.forEach(function(o){if(i={x:e,y:o},n=t.grid.cellContent(i)){var s=t.findFarthestPosition(i,r),l=t.grid.cellContent(s.next);if(l&&l.value===n.value&&!l.mergedFrom){var c=new Tile(s.next,2*n.value);c.mergedFrom=[n,l],t.grid.insertTile(c),t.grid.removeTile(n),n.updatePosition(s.next),t.score+=c.value,2048===c.value&&(t.won=!0)}else t.moveTile(n,s.farthest);t.positionsEqual(i,n)||(a=!0)}})}),a&&(this.addRandomTile(),this.movesAvailable()||(this.over=!0),this.actuate()),a}},GameManager.prototype.getVector=function(e){var t={0:{x:0,y:-1},1:{x:1,y:0},2:{x:0,y:1},3:{x:-1,y:0}};return t[e]},GameManager.prototype.buildTraversals=function(e){for(var t={x:[],y:[]},i=0;i<this.size;i++)t.x.push(i),t.y.push(i);return 1===e.x&&(t.x=t.x.reverse()),1===e.y&&(t.y=t.y.reverse()),t},GameManager.prototype.findFarthestPosition=function(e,t){var i;do i=e,e={x:i.x+t.x,y:i.y+t.y};while(this.grid.withinBounds(e)&&this.grid.cellAvailable(e));return{farthest:i,next:e}},GameManager.prototype.movesAvailable=function(){return this.grid.cellsAvailable()||this.tileMatchesAvailable()},GameManager.prototype.tileMatchesAvailable=function(){for(var e,t=this,i=0;i<this.size;i++)for(var n=0;n<this.size;n++)if(e=this.grid.cellContent({x:i,y:n}))for(var r=0;4>r;r++){var o=t.getVector(r),a={x:i+o.x,y:n+o.y},s=t.grid.cellContent(a);if(s&&s.value===e.value)return!0}return!1},GameManager.prototype.positionsEqual=function(e,t){return e.x===t.x&&e.y===t.y},Grid.prototype.empty=function(){for(var e=[],t=0;t<this.size;t++)for(var i=e[t]=[],n=0;n<this.size;n++)i.push(null);return e},Grid.prototype.fromState=function(e){for(var t=[],i=0;i<this.size;i++)for(var n=t[i]=[],r=0;r<this.size;r++){var o=e[i][r];n.push(o?new Tile(o.position,o.value):null)}return t},Grid.prototype.randomAvailableCell=function(){var e=this.availableCells();return e.length?e[Math.floor(Math.random()*e.length)]:void 0},Grid.prototype.availableCells=function(){var e=[];return this.eachCell(function(t,i,n){n||e.push({x:t,y:i})}),e},Grid.prototype.eachCell=function(e){for(var t=0;t<this.size;t++)for(var i=0;i<this.size;i++)e(t,i,this.cells[t][i])},Grid.prototype.cellsAvailable=function(){return!!this.availableCells().length},Grid.prototype.cellAvailable=function(e){return!this.cellOccupied(e)},Grid.prototype.cellOccupied=function(e){return!!this.cellContent(e)},Grid.prototype.cellContent=function(e){return this.withinBounds(e)?this.cells[e.x][e.y]:null},Grid.prototype.insertTile=function(e){this.cells[e.x][e.y]=e},Grid.prototype.removeTile=function(e){this.cells[e.x][e.y]=null},Grid.prototype.withinBounds=function(e){return e.x>=0&&e.x<this.size&&e.y>=0&&e.y<this.size},Grid.prototype.serialize=function(){for(var e=[],t=0;t<this.size;t++)for(var i=e[t]=[],n=0;n<this.size;n++)i.push(this.cells[t][n]?this.cells[t][n].serialize():null);return{size:this.size,cells:e}},Grid.prototype.countTileSum=function(){for(var e=this,t=0,i=0,n=0;n<e.size;n++)for(var r=0;r<e.size;r++)null!=e.cells[n][r]&&(i+=e.cells[n][r].value,t+=1);return i/t},Grid.prototype.getVector=function(e){var t={0:{x:0,y:-1},1:{x:1,y:0},2:{x:0,y:1},3:{x:-1,y:0}};return t[e]},Grid.prototype.buildTraversals=function(e){for(var t={x:[],y:[]},i=0;i<this.size;i++)t.x.push(i),t.y.push(i);return 1===e.x&&(t.x=t.x.reverse()),1===e.y&&(t.y=t.y.reverse()),t},Grid.prototype.clone=function(){for(var e=this,t=new Grid(e.size,null),i=0;i<e.size;i++)for(var n=0;n<e.size;n++)t.cells[i][n]=null===e.cells[i][n]?null:new Tile({x:e.cells[i][n].x,y:e.cells[i][n].y},e.cells[i][n].value);return t},Grid.prototype.printGrid=function(){console.log("printing grid");for(var e=this,t="",i=0;i<e.size;i++){for(var n=0;n<e.size;n++)t+=null===e.cells[n][i]?"0 ":e.cells[n][i].value+" ";t+="\n"}console.log(t)},move=["up","right","down","left"],Grid.prototype.findFarthestPosition=function(e,t){var i,n=this;do i=e,e={x:i.x+t.x,y:i.y+t.y};while(n.withinBounds(e)&&n.cellAvailable(e));return{farthest:i,next:e}},Grid.prototype.moveTile=function(e,t){this.cells[e.x][e.y]=null,this.cells[t.x][t.y]=e,e.updatePosition(t)},Grid.prototype.positionsEqual=function(e,t){return e.x===t.x&&e.y===t.y},Grid.prototype.move=function(e){var t,i,n=this,r=this.getVector(e),o=this.buildTraversals(r),a=!1;return n.eachCell(function(e,t,i){i&&(i.mergedFrom=null,i.savePosition())}),o.x.forEach(function(e){o.y.forEach(function(o){if(t={x:e,y:o},i=n.cellContent(t)){var s=n.findFarthestPosition(t,r),l=n.cellContent(s.next);if(l&&l.value===i.value&&!l.mergedFrom){var c=new Tile(s.next,2*i.value);c.mergedFrom=[i,l],n.insertTile(c),n.removeTile(i),i.updatePosition(s.next)}else n.moveTile(i,s.farthest);n.positionsEqual(t,i)||(a=!0)}})}),a};var priority=[[6,5,4,1],[5,4,1,0],[4,1,0,-1],[1,0,-1,-2]];Grid.prototype.getScore=function(){var e=this,t=0;this.eachCell(function(e,i,n){n&&(t+=priority[e][i]*n.value*n.value)});var i=0,n=[[1,0],[0,1],[-1,0],[0,-1]];return this.eachCell(function(t,r,o){if(o)for(var a=0;4>a;a++){var s={x:t+n[a][0],y:r+n[a][1]};if(e.withinBounds(s)){var l=e.cells[s.x][s.y];l&&(i+=1*Math.abs(l.value-o.value))}}}),t-i},HTMLActuator.prototype.actuate=function(e,t){var i=this;window.requestAnimationFrame(function(){i.clearContainer(i.tileContainer),e.cells.forEach(function(e){e.forEach(function(e){e&&i.addTile(e)})}),i.updateScore(t.score),i.updateBestScore(t.bestScore),t.terminated&&(t.over?i.message(!1):t.won&&i.message(!0))})},HTMLActuator.prototype.continueGame=function(){this.clearMessage()},HTMLActuator.prototype.clearContainer=function(e){for(;e.firstChild;)e.removeChild(e.firstChild)},HTMLActuator.prototype.addTile=function(e){var t=this,i=document.createElement("div"),n=document.createElement("div"),r=e.previousPosition||{x:e.x,y:e.y},o=this.positionClass(r),a=["tile","tile-"+e.value,o];e.value>2048&&a.push("tile-super"),this.applyClasses(i,a),n.classList.add("tile-inner"),n.textContent=e.value,e.previousPosition?window.requestAnimationFrame(function(){a[2]=t.positionClass({x:e.x,y:e.y}),t.applyClasses(i,a)}):e.mergedFrom?(a.push("tile-merged"),this.applyClasses(i,a),e.mergedFrom.forEach(function(e){t.addTile(e)})):(a.push("tile-new"),this.applyClasses(i,a)),i.appendChild(n),this.tileContainer.appendChild(i)},HTMLActuator.prototype.applyClasses=function(e,t){e.setAttribute("class",t.join(" "))},HTMLActuator.prototype.normalizePosition=function(e){return{x:e.x+1,y:e.y+1}},HTMLActuator.prototype.positionClass=function(e){return e=this.normalizePosition(e),"tile-position-"+e.x+"-"+e.y},HTMLActuator.prototype.updateScore=function(e){this.clearContainer(this.scoreContainer);var t=e-this.score;if(this.score=e,this.scoreContainer.textContent=this.score,t>0){var i=document.createElement("div");i.classList.add("score-addition"),i.textContent="+"+t,this.scoreContainer.appendChild(i)}},HTMLActuator.prototype.updateBestScore=function(e){this.bestContainer.textContent=e},HTMLActuator.prototype.message=function(e){var t=e?"game-won":"game-over",i=e?"You win!":"Game over!";this.messageContainer.classList.add(t),this.messageContainer.getElementsByTagName("p")[0].textContent=i},HTMLActuator.prototype.clearMessage=function(){this.messageContainer.classList.remove("game-won"),this.messageContainer.classList.remove("game-over")},KeyboardInputManager.prototype.on=function(e,t){this.events[e]||(this.events[e]=[]),this.events[e].push(t)},KeyboardInputManager.prototype.emit=function(e,t){var i=this.events[e];i&&i.forEach(function(e){e(t)})},KeyboardInputManager.prototype.listen=function(){var e=this,t={38:0,39:1,40:2,37:3,75:0,76:1,74:2,72:3,87:0,68:1,83:2,65:3};document.addEventListener("keydown",function(i){var n=i.altKey||i.ctrlKey||i.metaKey||i.shiftKey,r=t[i.which];n||void 0!==r&&(i.preventDefault(),e.emit("move",r)),n||82!==i.which||e.restart.call(e,i)}),this.bindButtonPress(".retry-button",this.restart),this.bindButtonPress(".restart-button",this.restart),this.bindButtonPress(".keep-playing-button",this.keepPlaying);var i,n,r=document.getElementsByClassName("game-container")[0];r.addEventListener(this.eventTouchstart,function(e){!window.navigator.msPointerEnabled&&e.touches.length>1||e.targetTouches>1||(window.navigator.msPointerEnabled?(i=e.pageX,n=e.pageY):(i=e.touches[0].clientX,n=e.touches[0].clientY),e.preventDefault())}),r.addEventListener(this.eventTouchmove,function(e){e.preventDefault()}),r.addEventListener(this.eventTouchend,function(t){if(!(!window.navigator.msPointerEnabled&&t.touches.length>0||t.targetTouches>0)){var r,o;window.navigator.msPointerEnabled?(r=t.pageX,o=t.pageY):(r=t.changedTouches[0].clientX,o=t.changedTouches[0].clientY);var a=r-i,s=Math.abs(a),l=o-n,c=Math.abs(l);Math.max(s,c)>10&&e.emit("move",s>c?a>0?1:3:l>0?2:0)}})},KeyboardInputManager.prototype.restart=function(e){e.preventDefault(),this.emit("restart")},KeyboardInputManager.prototype.keepPlaying=function(e){e.preventDefault(),this.emit("keepPlaying")},KeyboardInputManager.prototype.bindButtonPress=function(e,t){var i=document.querySelector(e);i.addEventListener("click",t.bind(this)),i.addEventListener(this.eventTouchend,t.bind(this))},window.fakeStorage={_data:{},setItem:function(e,t){return this._data[e]=String(t)},getItem:function(e){return this._data.hasOwnProperty(e)?this._data[e]:void 0},removeItem:function(e){return delete this._data[e]},clear:function(){return this._data={}}},LocalStorageManager.prototype.localStorageSupported=function(){var e="test",t=window.localStorage;try{return t.setItem(e,"1"),t.removeItem(e),!0}catch(i){return!1}},LocalStorageManager.prototype.getBestScore=function(){return this.storage.getItem(this.bestScoreKey)||0},LocalStorageManager.prototype.setBestScore=function(e){this.storage.setItem(this.bestScoreKey,e)},LocalStorageManager.prototype.getGameState=function(){var e=this.storage.getItem(this.gameStateKey);return e?JSON.parse(e):null},LocalStorageManager.prototype.setGameState=function(e){this.storage.setItem(this.gameStateKey,JSON.stringify(e))},LocalStorageManager.prototype.clearGameState=function(){this.storage.removeItem(this.gameStateKey)},Tile.prototype.savePosition=function(){this.previousPosition={x:this.x,y:this.y}},Tile.prototype.updatePosition=function(e){this.x=e.x,this.y=e.y},Tile.prototype.serialize=function(){return{position:{x:this.x,y:this.y},value:this.value}};