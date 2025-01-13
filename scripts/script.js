// Класс генерации змейки
class Snake {
    #boardSize;
    #body;
    #direction;

    constructor(boardSize) {
        this.#boardSize = boardSize;
        this.#body = [];
        this.#direction = {x: 1, y: 0};
        this.#initSnake();
    }

    // Метод инициализация позиции змейки
    #initSnake() {
        this.#body = [
            {x: 10, y: 10},
            {x: 9, y: 10},
        ];
    }

    // Метод движения змейки
    move() {
        const head = {...this.#body[0]};

        head.x += this.#direction.x;
        head.y += this.#direction.y;

        if (head.x < 0) head.x = this.#boardSize - 1;
        if (head.x >= this.#boardSize) head.x = 0;
        if (head.y < 0) head.y = this.#boardSize - 1;
        if (head.y >= this.#boardSize) head.y = 0;

        this.#body.unshift(head);
    }

    // Метод изменения направления движения змейки
    changeDirection(newDirection) {
        this.#direction = newDirection;
    }

    // Метод проверки столкновения змейки с самой собой
    checkCollision() {
        const [head, ...body] = this.#body;
        return body.some((segment) => segment.x === head.x && segment.y === head.y);
    }

    // Сброс положения змейки
    reset() {
        this.#initSnake();
    }

    // Геттер получения значения положения змейки
    get body() {
        return this.#body;
    }

    // Геттер направления движения змейки
    get direction() {
        return this.#direction;
    }
}

// Класс генерации яблока
class Apple {
    #boardSize;
    #snake;
    #position;

    constructor(boardSize, snake) {
        this.#boardSize = boardSize;
        this.#snake = snake;
        this.#position = this.#randomizePosition();
    }

    // Метод создания случайной генерации положения яблока
    #randomizePosition() {
        let newPosition;
        let isOnSnake;

        do {
            newPosition = {
                x: Math.floor(Math.random() * this.#boardSize),
                y: Math.floor(Math.random() * this.#boardSize),
            };
            isOnSnake = this.#snake.body.some(
                (segment) => segment.x === newPosition.x && segment.y === newPosition.y
            );
        } while (isOnSnake);

        return newPosition;
    }

    // Геттер положения яблока
    get position() {
        return this.#position;
    }

    // Сеттер положения яблока
    set position(newPosition) {
        this.#position = newPosition;
    }

    // Присвоение случайной позиции
    randomizePosition() {
        this.#position = this.#randomizePosition();
    }
}

// Класс для создания игрового поля, инициализации и отрисовки поля
class SnakeGame {
    #boardSize;
    #board;
    #scoreElement;
    #highScoreElement;
    #startButton;
    #gameOverElement;
    #cells;
    #intervalId;
    #score;
    #highScore;
    #gameStarted;
    #isInitialLoad;
    #lightGameField;
    #darkGameField;
    #snake;
    #food;
    #canChangeDirection;
    #snakeSpeed;
    #minSnakeSpeed;

    constructor(boardSize) {
        this.#boardSize = boardSize;
        this.#board = document.getElementById("game-board");
        this.#scoreElement = document.getElementById("score");
        this.#highScoreElement = document.getElementById("high-score");
        this.#startButton = document.getElementById("start-button");
        this.#gameOverElement = document.getElementById("game-over");
        this.#cells = [];
        this.#intervalId = null;
        this.#score = 0;
        this.#highScore = localStorage.getItem("highScore") || 0;
        this.#gameStarted = false;
        this.#isInitialLoad = true;

        this.#lightGameField = "#a1f542";
        this.#darkGameField = "#1aba25";
        this.#snakeSpeed = 500;
        this.#minSnakeSpeed = 100;

        this.#snake = new Snake(this.#boardSize);
        this.#food = new Apple(this.#boardSize, this.#snake);

        this.#createBoard();
        this.#initGame();
        this.#draw();
    }

    // Метод создания игрового поля
    #createBoard() {
        for (let i = 0; i < this.#boardSize * this.#boardSize; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (Math.floor(i / this.#boardSize) % 2 === 0) {
                cell.style.backgroundColor =
                    i % 2 === 0 ? this.#lightGameField : this.#darkGameField;
            } else {
                cell.style.backgroundColor =
                    i % 2 === 0 ? this.#darkGameField : this.#lightGameField;
            }
            this.#board.appendChild(cell);
            this.#cells.push(cell);
        }
    }

    // Метод инициализации игры
    #initGame() {
        this.#updateScore();
        this.#startButton.addEventListener("click", () => this.startGame());
        this.#board.addEventListener("click", () => {
            if (!this.#gameStarted) this.startGame();
        });
        this.#gameOverElement.addEventListener("click", () => this.startGame());
        document.addEventListener("keydown", (e) => this.#handleKeydown(e));
    }

    // Метод запуска игры
    startGame() {
        clearInterval(this.#intervalId);
        if (!this.#isInitialLoad) {
            this.#snake.reset();
            this.#food.randomizePosition();
        }
        this.#score = 0;
        this.#snakeSpeed = 500; // Сброс скорости змейки к изначальному значению
        this.#updateScore();
        this.#gameOverElement.style.display = "none";
        this.#startButton.style.visibility = "hidden";
        this.#gameStarted = true;
        this.#canChangeDirection = true;
        this.#intervalId = setInterval(() => this.update(), this.#snakeSpeed);
        this.#draw();
        this.#isInitialLoad = false;
    }

    // Метод обновления переменных игрового поля
    update() {
        this.#snake.move();

        if (this.#snake.checkCollision()) {
            clearInterval(this.#intervalId);
            // Сброс флагов к прежнему значению и обновление лучшего результата
            this.#gameOverElement.style.display = "block";
            this.#checkHighScore();
            this.#startButton.style.visibility = "visible";
            this.#gameStarted = false;
            // Возврат напраления движения к прошлому значению при перезапуске
            this.#snake.changeDirection({x: 1, y: 0});
            return;
        }

        if (this.#isFoodEaten()) {
            this.#score++;
            this.#updateScore();
            this.#food.randomizePosition();
            // Увеличение скорости при съедении яблока
            if (this.#snakeSpeed > this.#minSnakeSpeed) {
                this.#snakeSpeed -= 50;
            }
            clearInterval(this.#intervalId);
            this.#intervalId = setInterval(() => this.update(), this.#snakeSpeed);
        } else {
            this.#snake.body.pop();
        }

        this.#draw();
        this.#canChangeDirection = true;
    }

    // Проверка не съедено ли яблоко
    #isFoodEaten() {
        const head = this.#snake.body[0];
        return head.x === this.#food.position.x && head.y === this.#food.position.y;
    }

    // Обновление игрового результата
    #updateScore() {
        this.#scoreElement.innerHTML = `Score <span>${this.#score}</span>`;
        this.#highScoreElement.innerHTML = `High Score <span>${
            this.#highScore
        }</span>`;
    }

    // Проверка лучшего результата игрока
    #checkHighScore() {
        if (this.#score > this.#highScore) {
            this.#highScore = this.#score;
            localStorage.setItem("highScore", this.#highScore);
        }
    }

    // Метод проверки нажатия на клавиши клавиатуры
    #handleKeydown(event) {
        if (!this.#canChangeDirection) return;

        switch (event.keyCode) {
            case 37:
                if (this.#snake.direction.x === 0)
                    this.#snake.changeDirection({x: -1, y: 0});
                break;
            case 38:
                if (this.#snake.direction.y === 0)
                    this.#snake.changeDirection({x: 0, y: -1});
                break;
            case 39:
                if (this.#snake.direction.x === 0)
                    this.#snake.changeDirection({x: 1, y: 0});
                break;
            case 40:
                if (this.#snake.direction.y === 0)
                    this.#snake.changeDirection({x: 0, y: 1});
                break;
        }

        this.#canChangeDirection = false;
    }

    // Отрисовка изменений на игровом поле
    #draw() {
        const snakeColor = "#9a521b";
        const appleColor = "#FF0000FF";

        this.#cells.forEach((cell, index) => {
            cell.classList.remove("snake", "snake-head", "food");
            const row = Math.floor(index / this.#boardSize);
            const color1 =
                index % 2 === 0 ? this.#lightGameField : this.#darkGameField;
            const color2 =
                index % 2 === 0 ? this.#darkGameField : this.#lightGameField;
            cell.style.backgroundColor = row % 2 === 0 ? color1 : color2;
        });

        this.#snake.body.forEach((segment, idx) => {
            const index = segment.y * this.#boardSize + segment.x;
            const cell = this.#cells[index];
            if (cell) {
                cell.classList.add("snake");
                if (Number(idx) === 0) {
                    cell.classList.add("snake-head");
                }
                cell.style.backgroundColor = snakeColor;
            }
        });

        const foodIndex =
            this.#food.position.y * this.#boardSize + this.#food.position.x;
        const foodCell = this.#cells[foodIndex];
        if (foodCell) {
            foodCell.classList.add("food");
            foodCell.style.backgroundColor = appleColor;
        }
    }
}

// Создание после полной загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    try {
        new SnakeGame(20);
    } catch (e) {
        console.error("Error initializing the game:", e);
    }
});
