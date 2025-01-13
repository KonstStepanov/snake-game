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
