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
