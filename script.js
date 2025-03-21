// Elementos del DOM
const operationElement = document.getElementById("operation");
const optionsContainer = document.getElementById("options");
const optionButtons = document.querySelectorAll(".option");
const resultElement = document.getElementById("result");
const stopButton = document.getElementById("stop");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const timerElement = document.getElementById("timer");
const statsElement = document.getElementById("stats");

// Variables del juego
let currentOperation = "";
let correctAnswer = 0;
let isPlaying = false;
let timer;
let timeLeft = 120; // 2 minutos en segundos
let correctCount = 0;
let incorrectCount = 0;
let previousOperation = "";
let playerName = ""; // Variable para almacenar el nombre del jugador

// Ocultar el juego al inicio
document.getElementById("timer").style.display = "none";
document.getElementById("operation").style.display = "none";
document.getElementById("options").style.display = "none";
document.getElementById("result").style.display = "none";
document.getElementById("stats").style.display = "none";
document.getElementById("stop").style.display = "none";

// Manejar el formulario del nombre
document.getElementById("nameForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe
    playerName = document.getElementById("nameInput").value.trim();

    if (playerName === "") {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    // Ocultar el formulario y mostrar el juego
    document.getElementById("nameForm").style.display = "none";
    document.getElementById("timer").style.display = "block";
    document.getElementById("operation").style.display = "block";
    document.getElementById("options").style.display = "grid";
    document.getElementById("result").style.display = "block";
    document.getElementById("stats").style.display = "block";
    document.getElementById("stop").style.display = "inline-block";

    // Iniciar el juego
    startGame();
});

// Función para generar una operación aleatoria
function generateOperation() {
    console.log("Generando nueva operación..."); // Depuración
    const operations = ["+", "-", "·", "/"];
    let randomOperation, num1, num2;

    // Función para generar un número entero aleatorio dentro de un rango
    function getRandomInt(min, max, negativeProbability = 0.6) {
        const isNegative = Math.random() < negativeProbability; // 60% de probabilidad de ser negativo
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        return isNegative ? -number : number;
    }

    // Función para formatear la operación
    function formatOperation(num1, num2, operation) {
        function formatNumber(number, isFirstTerm = false) {
            // Si es el primer término y es negativo, no añadir paréntesis
            if (isFirstTerm && number < 0) {
                return number;
            }
            // Si no es el primer término y es negativo, añadir paréntesis
            return number < 0 ? `(${number})` : number;
        }
        return `${formatNumber(num1, true)} ${operation} ${formatNumber(num2)}`;
    }

    // Generar una nueva operación hasta que sea diferente a la anterior
    do {
        randomOperation = operations[Math.floor(Math.random() * operations.length)];

        if (randomOperation === "+" || randomOperation === "-") {
            // Sumas y restas: números entre -15 y 15
            num1 = getRandomInt(0, 15, 0.6); // Primer término tiene 60% de probabilidad de ser negativo
            num2 = getRandomInt(0, 15); // Segundo término siempre positivo

            // Si es una suma y el segundo término es negativo, convertirlo en una resta
            if (randomOperation === "+" && num2 < 0) {
                randomOperation = "-";
                num2 = Math.abs(num2); // Convertir el segundo término a positivo
            }
            // Si es una resta y el segundo término es negativo, convertirlo en una suma
            else if (randomOperation === "-" && num2 < 0) {
                randomOperation = "+";
                num2 = Math.abs(num2); // Convertir el segundo término a positivo
            }
        } else if (randomOperation === "·") {
            // Multiplicaciones: números entre -10 y 10
            num1 = getRandomInt(0, 10, 0.6); // Primer término tiene 60% de probabilidad de ser negativo
            num2 = getRandomInt(0, 10, 0.6); // Segundo término tiene 60% de probabilidad de ser negativo
        } else if (randomOperation === "/") {
            // Divisiones: asegurar que sean exactas y estén en las tablas del 1 al 10
            num2 = getRandomInt(1, 10); // Divisor entre 1 y 10 (siempre positivo)
            num1 = num2 * getRandomInt(0, 10, 0.6); // Dividendo tiene 60% de probabilidad de ser negativo
        }

        currentOperation = formatOperation(num1, num2, randomOperation);
    } while (currentOperation === previousOperation); // Repetir hasta que la operación sea diferente a la anterior

    previousOperation = currentOperation; // Guardar la operación actual como la anterior
    correctAnswer = eval(currentOperation.replace("·", "*")); // Calcular la respuesta correcta
    operationElement.textContent = currentOperation; // Mostrar la operación en la pantalla
    console.log("Operación generada:", currentOperation); // Depuración

    // Generar opciones de respuesta
    generateOptions(num1, num2); // <-- Pasar num1 y num2 como parámetros
}

// Función para generar opciones de respuesta
function generateOptions(num1, num2) {
    console.log("Generando opciones de respuesta..."); // Depuración
    const options = [];

    // 1. Añadir la respuesta correcta
    options.push(correctAnswer);

    // 2. Añadir el número 0 (siempre presente)
    options.push(0);

    // 3. Generar opciones específicas según el tipo de operación
    const operation = currentOperation.split(" ")[1]; // Obtener el operador (+, -, ·, /)

    switch (operation) {
        case "+": // Suma
            // Opción: Incluir el número opuesto
            options.push(-correctAnswer);
            // Opción: Restar en lugar de sumar
            options.push(num1 - num2);
            // Opción: Números cercanos
            options.push(correctAnswer - 1);
            options.push(correctAnswer + 1);
            // Opción: Números de la operación
            options.push(num1);
            options.push(num2);
            break;

        case "-": // Resta
            // Opción: Incluir el número opuesto
            options.push(-correctAnswer);
            // Opción: Sumar en lugar de restar
            options.push(num1 + num2);
            // Opción: Números cercanos
            options.push(correctAnswer - 1);
            options.push(correctAnswer + 1);
            // Opción: Números de la operación
            options.push(num1);
            options.push(num2);
            break;

        case "·": // Multiplicación
            // Opción: Incluir el número opuesto
            options.push(-correctAnswer);
            // Opción: Sumar en lugar de multiplicar
            options.push(num1 + num2);
            // Opción: Números cercanos
            options.push(correctAnswer - 5);
            options.push(correctAnswer + 5);
            // Opción: Números de la operación
            options.push(num1);
            options.push(num2);
            break;

        case "/": // División
            // Opción: Incluir el número opuesto
            options.push(-correctAnswer);
            // Opción: Multiplicar en lugar de dividir
            options.push(num1 * num2);
            // Opción: Números cercanos
            options.push(correctAnswer - 1);
            options.push(correctAnswer + 1);
            // Opción: Números de la operación
            options.push(num1);
            options.push(num2);
            break;
    }

    // Eliminar duplicados y reemplazarlos
    const uniqueOptions = [];
    for (let i = 0; i < options.length; i++) {
        if (!uniqueOptions.includes(options[i])) {
            uniqueOptions.push(options[i]); // Añadir si no está duplicado
        } else {
            // Si está duplicado, generar un número único
            let newOption;
            do {
                newOption = correctAnswer + Math.floor(Math.random() * 10) - 5; // Número cercano a la respuesta correcta
            } while (uniqueOptions.includes(newOption)); // Evitar duplicados
            uniqueOptions.push(newOption);
        }
    }

    // Mezclar las opciones
    uniqueOptions.sort(() => Math.random() - 0.5);

    // Asignar las opciones a los botones
    optionButtons.forEach((button, index) => {
        button.textContent = uniqueOptions[index];
        button.classList.remove("correct", "incorrect"); // Limpiar estilos anteriores
        button.disabled = false; // Habilitar el botón
    });
    console.log("Opciones generadas:", uniqueOptions); // Depuración
}

// Función para verificar la respuesta seleccionada
function checkAnswer(selectedButton) {
    if (!isPlaying) return;

    const selectedAnswer = parseFloat(selectedButton.textContent);
    if (selectedAnswer === correctAnswer) {
        resultElement.textContent = "¡Correcto!";
        resultElement.style.color = "green";
        selectedButton.classList.add("correct");
        correctCount++;

        // Avanzar inmediatamente después de un breve retraso
        setTimeout(() => {
            resultElement.textContent = "";
            generateOperation();
        }, 250); // Medio segundo de retraso para feedback visual
    } else {
        resultElement.textContent = `Incorrecto. La respuesta correcta era ${correctAnswer}.`;
        resultElement.style.color = "red";
        selectedButton.classList.add("incorrect");
        incorrectCount++;

        // Deshabilitar los botones después de seleccionar una respuesta
        optionButtons.forEach(button => {
            button.disabled = true;
        });

        // Habilitar un botón "Siguiente" para continuar
        const nextButton = document.createElement("button");
        nextButton.textContent = "Siguiente";
        nextButton.id = "next";
        nextButton.style.marginTop = "10px";
        document.querySelector(".container").appendChild(nextButton);

        // Esperar a que el usuario haga clic en "Siguiente" para continuar
        nextButton.addEventListener("click", () => {
            resultElement.textContent = "";
            nextButton.remove(); // Eliminar el botón "Siguiente"
            generateOperation();
        });
    }

    // Actualizar estadísticas
    statsElement.textContent = `Aciertos: ${correctCount} | Errores: ${incorrectCount}`;
}

// Función para iniciar el juego
function startGame() {
    console.log("Iniciando juego..."); // Depuración
    isPlaying = true;
    timeLeft = 120; // Reiniciar el tiempo
    correctCount = 0;
    incorrectCount = 0;
    statsElement.textContent = "Aciertos: 0 | Errores: 0";
    startButton.style.display = "none";
    stopButton.style.display = "inline-block";
    restartButton.style.display = "none";
    optionButtons.forEach(button => button.disabled = false);
    generateOperation();
    startTimer();
}

// Función para detener el juego
function stopGame() {
    console.log("Deteniendo juego..."); // Depuración
    isPlaying = false;
    clearInterval(timer);
    resultElement.textContent = "Juego detenido.";
    resultElement.style.color = "black";
    stopButton.style.display = "none";
    restartButton.style.display = "inline-block";
    optionButtons.forEach(button => button.disabled = true);
    showFinalStats();
}

// Función para reiniciar el juego
function restartGame() {
    console.log("Reiniciando juego..."); // Depuración
    startGame();
}

// Función para iniciar el temporizador
function startTimer() {
    console.log("Iniciando temporizador..."); // Depuración
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Tiempo restante: ${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            stopGame();
        }
    }, 1000);
}

// Función para mostrar estadísticas finales
function showFinalStats() {
    const totalQuestions = correctCount + incorrectCount;
    const accuracy = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : 0;
    resultElement.textContent = `Juego terminado. Aciertos: ${correctCount}, Errores: ${incorrectCount}, Porcentaje de acierto: ${accuracy}%`;

    // Enviar resultados a Google Forms
    const formURL = "https://docs.google.com/forms/d/e/https://docs.google.com/forms/d/e/1FAIpQLSeYh0Jea1pLqJtJuHZzoQX4EbxN4UkStibznOyzRPr605APbQ"; // Reemplaza con tu URL
    const formData = new FormData();
    formData.append("entry.123456789", playerName); // Reemplaza con el ID del campo de nombre
    formData.append("entry.987654321", correctCount); // Reemplaza con el ID del campo de aciertos
    formData.append("entry.567891234", incorrectCount); // Reemplaza con el ID del campo de errores
    formData.append("entry.432156789", accuracy); // Reemplaza con el ID del campo de porcentaje

    fetch(formURL, {
        method: "POST",
        body: formData,
        mode: "no-cors", // Necesario para enviar datos a Google Forms
    }).then(() => {
        console.log("Resultados enviados correctamente.");
    }).catch((error) => {
        console.error("Error al enviar los resultados:", error);
    });
}

// Event listeners
optionButtons.forEach(button => {
    button.addEventListener("click", () => checkAnswer(button));
});
stopButton.addEventListener("click", stopGame);
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

// Inicializar el juego
optionButtons.forEach(button => button.disabled = true);
stopButton.style.display = "none";
restartButton.style.display = "none";