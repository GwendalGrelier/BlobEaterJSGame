document.addEventListener("DOMContentLoaded", function () {
    var gameHasStarted = false;
    var gameHasEnded;

    const canvas = document.getElementById("bouncy_canvas")
    const context = canvas.getContext("2d");

    // !###################################################
    // !################# MAIN ############################
    // !###################################################

    // Show starting screen
    // creates variables
    function startGame() {

        //! ########################################################
        //! ################## Classes #############################
        //! ########################################################

        class Player {
            constructor(x = canvas.width / 2, y = canvas.height / 2, size = 25, color = "green") {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;

                this.x_way = 1;
                this.y_way = 1;

                this.speed = 2;

                this.isInvincible = false;
                this.invicibilityDuration = 300; // 300* 17ms = 5s
            }
            move() {
                // Player Movment
                if (move_left) {
                    this.x_way = -1;
                }
                if (move_right) {
                    this.x_way = +1;
                }
                if (move_up) {
                    this.y_way = -1;
                }
                if (move_down) {
                    this.y_way = +1;
                }
                if (!move_left && !move_right) {
                    this.x_way = 0;
                }
                if (!move_up && !move_down) {
                    this.y_way = 0;
                }
                if (sprint) {
                    this.speed = 5;
                } else {
                    this.speed = 2;
                }
                // Collision box
                if (this.x + this.size >= canvas.width) {
                    this.x_way = 0;
                    this.x = canvas.width - this.size - 1;
                }
                if (this.x - this.size <= 0) {
                    this.x_way = 0;
                    this.x = this.size + 1;
                }
                if (this.y + this.size >= canvas.height) {
                    this.y_way = 0;
                    this.y = canvas.height - this.size - 1;
                }
                if (this.y - this.size <= 0) {
                    this.y_way = 0;
                    this.y = this.size + 1;
                }

                this.x = this.x + this.speed * this.x_way;
                this.y = this.y + this.speed * this.y_way;
            }

        }
        class Enemy {
            constructor(x = 15, y = 15, size = 15, color = "red") {
                this.id = Enemy.enemyCounter;
                Enemy.enemyCounter += 1;
                // this.x = 90;
                this.x = Math.floor(Math.random() * (canvas.width - 15)) + 15;

                this.y = y;

                this.size = size;
                this.color = color;

                this.x_way = Math.round(Math.random() * 3) - 2;
                // this.x_way = 0;

                this.y_way = 1;
                this.speed = 1.5;
            }
            move() {
                if (this.x + this.size == canvas.width) {
                    this.x_way = -1;
                    // this.color = color_list[Math.floor(Math.random()*color_list.length)];

                } else if (this.x <= this.size) {
                    this.x_way = 1;
                    // this.color = color_list[Math.floor(Math.random()*color_list.length)];
                }
                if (this.y + this.size == canvas.height) {
                    this.y_way = -1;
                    // this.color = color_list[Math.floor(Math.random()*color_list.length)];
                } else if (this.y <= this.size) {
                    this.y_way = 1;
                    // this.color = color_list[Math.floor(Math.random()*color_list.length)];
                }
                this.x = Math.floor(this.x + this.speed * this.x_way);
                this.y = Math.floor(this.y + this.speed * this.y_way);
            }

        }
        class FixedBlob {
            constructor() {
                this.id = FixedBlob.fixedBlobCounter;
                FixedBlob.fixedBlobCounter += 1;

                this.finalSize = Math.floor(Math.random() * (20 - 60)) + 60;
                this.isDeadly = false;

                this.x = Math.floor(Math.random() * (canvas.width - 60)) + 60;
                this.y = Math.floor(Math.random() * (canvas.height - 60)) + 60;


                // this.x = 100;
                // this.y = 300;
                this.size = 1;
                this.color = "grey";

            }
        }
        class Bonus {
            constructor() {
                this.x = Math.floor(Math.random() * (canvas.width - 60)) + 30;
                this.y = Math.floor(Math.random() * (canvas.height - 60)) + 30;
                // this.x = 100;
                // this.y = 100;

                this.size = 10;
                this.color = "yellow";
            }
        }
        class Score {
            constructor() {
                this.total_time = 0;
                this.blobEaten = 0;
                this.maxEnemyCount = 0;
                this.totalEnemyCount = 0;
                this.fixedBlobEaten = 0;
                this.bonusRetreived = 0;

                this.total_score = 0;
            }
        }

            

        //! ########################################################
        //! ################## Functions ###########################
        //! ########################################################

        //* SPAWN FUNCTIONS ----------------------------

        function spawnEnemy() {
            enemies.push(new Enemy());
            score.totalEnemyCount += 1;
        }

        function spawnFixedBlob() {
            fixedBlobs.push(new FixedBlob());
        }

        function spawnBonus() {
            bonuses.push(new Bonus());
        }


        //* DRAWING FUNCTIONS ------------------------

        function draw(player, enemies, fixedBlobs) {
            // draw() function to refresh the canvas and draw on sreen
            // each element: -player
            //               -enemies
            //               -fixedBlobs
            context.clearRect(0, 0, canvas.clientWidth, canvas.height);
            drawBlob(player);
            for (const enemy of enemies) {
                drawBlob(enemy);
            }
            for (const fixedBlob of fixedBlobs) {
                drawFixedBlob(fixedBlob);
                // drawBlob(fixedBlob);
            }
            for (const bonus of bonuses) {
                drawBonusBlob(bonus);
            }

            // Draw every fixedBlob except the last one
            for (let index = 0; index < fixedBlobs.length; index++) {
                var fixedBlob = fixedBlobs[index];
                // The last one is drawn progressively
                if (index == fixedBlobs.length - 1) {
                    // console.log("dernier blob");
                    drawFixedBlob(fixedBlob);
                } else {
                    // console.log('Autre Blob');
                    drawBlob(fixedBlob);

                }
            }

            if (player.isInvincible) {
                writeInvicibilityTimer(player.invicibilityDuration);
            }

            writeScoreInCanvas()
        }

        function drawFixedBlob(lastFixedBlob) {
            var locx = lastFixedBlob.x;
            var locy = lastFixedBlob.y;
            if (lastFixedBlob.size == lastFixedBlob.finalSize) {
                lastFixedBlob.isDeadly = true;
                lastFixedBlob.color = "black";
            } else {
                lastFixedBlob.size = lastFixedBlob.size + 0.5;
                lastFixedBlob.color = "grey";
            }
            context.beginPath();
            context.arc(locx, locy, lastFixedBlob.size, 0, 2 * Math.PI);
            context.fillStyle = lastFixedBlob.color;
            context.fill();
            context.stroke();

        }

        function drawBonusBlob(bonusBlob) {
            var locx = bonusBlob.x;
            var locy = bonusBlob.y;
            var size = bonusBlob.size;
            var color = bonusBlob.color;

            if (bonusBlob.size <= 5) {
                delete bonusBlob;
            } else {
                bonusBlob.size -= 0.01;
                context.beginPath();
                context.arc(locx, locy, size, 0, 2 * Math.PI);
                context.fillStyle = color;
                context.fill();
                context.stroke();
            }
        }

        function drawBlob(player) {
            locx = player.x;
            locy = player.y
            size = player.size;
            color = player.color;
            // context.clearRect(0,0, canvas.clientWidth, canvas.height);
            context.beginPath();
            context.arc(locx, locy, size, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
            context.stroke();
            // context.font = "20px Georgia";
            // context.fillStyle = "blue";
            // context.fillText(player.id, locx, locy);
        }

        function writeInvicibilityTimer(remaining_duration) {
            context.beginPath();
            context.font = "40px tahoma";
            var time = Math.floor(remaining_duration * 17 / 1000);
            context.fillStyle = "blue";
            if (time <= 1) {
                var blink = Math.floor(Math.random() * 2);
                if (blink == 1) {
                    context.fillStyle = "red";
                } else {
                    context.fillStyle = "blue";
                }
            }
            var text = "Invincibility: " + time;
            context.fillText(text, 15, 100);
        }

        function writeScoreInCanvas() {
            context.beginPath();
            context.font = "40px tahoma";
            context.fillStyle = "blue";
            var text = "Score: " + score.total_score;
            context.fillText(text, 15, 50);
        }
        //* UPDATE FUNCTIONS -----------------------

        function checkForCollision(playerCircle, enemies_list, fixedBlob_list) {

            //* Collisions between the player and enemies
            for (const enemyCircle of enemies_list) {
                var a;
                var x;
                var y;

                a = playerCircle.size + enemyCircle.size;
                x = playerCircle.x - enemyCircle.x;
                y = playerCircle.y - enemyCircle.y;


                if (a > Math.sqrt((x * x) + (y * y))) {
                    if (player.isInvincible) {
                        enemies.splice(enemyCircle.id, 1);
                        updateEnemiesId();
                        score.blobEaten += 1;
                    } else {
                        return true;
                    }
                }

            }


            //* Collisions between the player and Fixed Blobs
            for (const fixedBlob of fixedBlob_list) {
                var a;
                var x;
                var y;

                a = playerCircle.size + fixedBlob.size;
                x = playerCircle.x - fixedBlob.x;
                y = playerCircle.y - fixedBlob.y;


                if (a > Math.sqrt((x * x) + (y * y)) && fixedBlob.isDeadly) {
                    if (player.isInvincible) {
                        fixedBlobs.splice(fixedBlob.id, 1);
                        updateFixedBlobsId()
                        score.fixedBlobEaten += 1;
                    } else {
                        return true;
                    }
                }

            }

            //* Collisions between the enemies and fixedBlobs
            for (const enemyCircle of enemies_list) {

                for (const fixedBlob of fixedBlob_list) {
                    var a;
                    var x;
                    var y;

                    a = fixedBlob.size + enemyCircle.size;
                    x = fixedBlob.x - enemyCircle.x;
                    y = fixedBlob.y - enemyCircle.y;



                    if (a > Math.sqrt((x * x) + (y * y)) && fixedBlob.isDeadly) {
                        var x_ratio = -(x / fixedBlob.size)
                        enemyCircle.x_way = x_ratio;
                        var y_ratio = -(y / fixedBlob.size)
                        enemyCircle.y_way = y_ratio;

                        // enemyCircle.x_way = Math.round(Math.random() * 3) - 2;
                        // enemyCircle.y_way = Math.round(Math.random() * 3) - 2;
                    }
                }

            }

            //* Collision between the player and bonus blobs 
            for (const bonusBlob of bonuses) {
                var a;
                var x;
                var y;

                a = playerCircle.size + bonusBlob.size;
                x = playerCircle.x - bonusBlob.x;
                y = playerCircle.y - bonusBlob.y;

                if (a > Math.sqrt((x * x) + (y * y))) {
                    player.isInvincible = true;
                    bonuses = [];
                    score.bonusRetreived += 1;
                }
            }

            //* After every check, return false to keep on playing
            return false;
        }

        function updateEnemiesId() {
            for (let index = 0; index < enemies.length; index++) {
                const enemy = enemies[index];
                enemy.id = index;
            }
        }

        function updateFixedBlobsId() {
            for (let index = 0; index < fixedBlobs.length; index++) {
                const fixedBlob = fixedBlobs[index];
                fixedBlob.id = index;
            }
        }

        function updateScore() {
            var time_points = score.total_time * 2;
            var enemy_points = score.blobEaten * 2;
            var fixedBlobs_points = score.fixedBlobEaten * 5;
            var bonus_points = score.bonusRetreived * 10;

            score.total_score = time_points + enemy_points + fixedBlobs_points + bonus_points;

            // Write Score
            document.getElementById("time_elapsed").textContent = "Time elapsed: " + score.total_time + "s";
            document.getElementById("enemy_count").textContent = "Number of blobs: " + score.totalEnemyCount;
            document.getElementById("blob_eaten").textContent = "Number of blobs eaten: " + score.blobEaten;
            // writeScoreInCanvas();

        }


        function displayFinalResult() {
            context.filter = "blur(4px)";

            // Create main div
            var result_div = document.createElement("div");
            result_div.setAttribute("id", "result");
            result_div.style.textAlign = "center";
            result_div.style.backgroundColor = "white";
            result_div.style.width = "50%";
            result_div.style.height = "50%";
            result_div.style.position = "absolute";
            result_div.style.top = "25%";
            result_div.style.left = "25%";
            result_div.style.border = "1px solid black";
            result_div.style.borderRadius = "15px";
            result_div.style.boxShadow = "3px 3px 3px black";

            // Add Title
            var result_title = document.createElement("h2");
            result_title.style.textDecoration = "underline";
            var text = document.createTextNode("Results");
            result_title.appendChild(text);
            result_div.appendChild(result_title);

            // Time
            var result_time = document.createElement("p");
            text = document.createTextNode("Time elapsed: " + score.total_time + "s");
            result_time.appendChild(text);
            result_div.appendChild(result_time);

            // Total Enemy count
            var result_enemy_count = document.createElement("p");
            text = document.createTextNode("Total enemies spawned: " + score.totalEnemyCount);
            result_enemy_count.appendChild(text);
            result_div.appendChild(result_enemy_count);

            // Total Blob eaten
            var result_enemy_eaten_count = document.createElement("p");
            text = document.createTextNode("Total blob eaten: " + score.blobEaten);
            result_enemy_eaten_count.appendChild(text);
            result_div.appendChild(result_enemy_eaten_count);

            // Total Score
            var total_score = document.createElement("h3");
            text = document.createTextNode("Total Score: " + score.total_score);
            total_score.appendChild(text);
            result_div.appendChild(total_score);

            // Max Score
            var max_score = document.createElement("p");
            text = document.createTextNode("High score: 1524 (Gwendal)");
            max_score.appendChild(text);
            result_div.appendChild(max_score);

            // Restart
            var restart = document.createElement("p");
            text = document.createTextNode("Press Enter to Restart");
            restart.setAttribute("class", "start");
            restart.appendChild(text);
            result_div.appendChild(restart);

            // Add div to the screen
            document.getElementById("canvas_container").appendChild(result_div);
        }

        function engine() {

            //* Check For collision
            if (checkForCollision(player, enemies, fixedBlobs)) {
                clearInterval(game);
                clearInterval(enemySpawnTimer);
                clearInterval(fixedBlobSpawnTimer);
                clearInterval(spawnBonusTimer);
                gameHasEnded = true;

                displayFinalResult();
            }

            //* Move blobs
            for (const enemy of enemies) {
                enemy.move();
            }
            player.move();

            //* Starting Enemy spawn
            if (enemies.length == 35) {
                clearInterval(enemySpawnTimerFast);
            }

            //* Deal with invicibility
            if (player.isInvincible) {
                if (player.invicibilityDuration <= 0) {
                    player.isInvincible = false;
                    player.invicibilityDuration = 300;
                }
                player.invicibilityDuration -= 1;
            }

            //* Deal with Score
            // updateResults()
            var enemyNumber = enemies.length;
            if (enemyNumber > score.maxEnemyCount) {
                score.maxEnemyCount = enemyNumber;
            }
            score.total_time = ((Date.now() - start_time) / 1000).toFixed();
            updateScore()

            draw(player, enemies, fixedBlobs)
        }

        var start_time = Date.now();
        gameHasStarted = true;
        var start_screen = document.getElementById("start_screen");
        var end_screen = document.getElementById("result");
        if (start_screen) {
            document.getElementById("canvas_container").removeChild(start_screen);
        } else if (end_screen) {
            document.getElementById("canvas_container").removeChild(end_screen);
            context.filter = "none";
        }

        let player = new Player();
        let enemies = [];
        let fixedBlobs = [];
        let bonuses = [];

        Enemy.enemyCounter = 0;
        FixedBlob.fixedBlobCounter = 0;

        let score = new Score();

        // start the game engine (main loop)
        let game = setInterval(engine, 17); // Set to 60fps

        // Start Spawning timers
        let enemySpawnTimer = setInterval(spawnEnemy, 1000 * 2); // 3sec
        let enemySpawnTimerFast = setInterval(spawnEnemy, 500); // 0.5sec
        let fixedBlobSpawnTimer = setInterval(spawnFixedBlob, 1000 * 6); // 6sec
        let spawnBonusTimer = setInterval(spawnBonus, 1000 * 25);
    }

    // Create events listneners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    var move_left, move_right, move_up, move_down, sprint = false;
    function handleKeyDown(event) {
        if (event.keyCode == 37) { // Left
            move_left = true;
        } else if (event.keyCode == 39) { // Right
            move_right = true;
        } else if (event.keyCode == 38) { // Up
            move_up = true;
        } else if (event.keyCode == 40) { // Down
            move_down = true;
        } else if (event.keyCode == 32) {
            sprint = true;
        } else if (event.keyCode == 13) {
            if (gameHasStarted == false) {
                startGame();
            } else if (gameHasEnded) {
                startGame();
            }
        } else if (event.keyCode == 18) { // pass
            console.log("alt");
            event.preventDefault();
            
        }
    }

    function handleKeyUp(event) {
        if (event.keyCode == 37) { // Left
            move_left = false;
        } else if (event.keyCode == 39) { // Right
            move_right = false;
        } else if (event.keyCode == 38) { // Up
            move_up = false;
        } else if (event.keyCode == 40) { // Down
            move_down = false;
        } else if (event.keyCode == 32) {
            sprint = false;
        } else if (event.keyCode == 18) { // pass
            console.log("alt");
            event.preventDefault();
            
        }
    }
});
