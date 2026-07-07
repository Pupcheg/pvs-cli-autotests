// error_example.ts — ещё больше ошибок

// Переменная с потенциально опасным значением
let count: number = 0;

// Деление на ноль (если анализатор это находит)
let result: number = 10 / count;

// Использование переменной с неопределённым значением
let isActive: boolean;
if (isActive) {
    console.log("Active");
}

// Пустая функция с побочным эффектом
function doNothing(): void {
    // ничего не делает
}

// Сравнение с undefined без проверки
let data: any = undefined;
if (data === undefined) {
    console.log("Data is undefined");
}