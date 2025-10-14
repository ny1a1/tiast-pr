const BASE_URL = 'http://localhost:8080';

// Отримати поточний стан Item
async function getCurrentItemValue(itemName) {
    const response = await fetch(`${BASE_URL}/rest/items/${itemName}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.state;
}

// Відправити команду Item (ON/OFF)
async function sendCommand(itemName, command) {
    const response = await fetch(`${BASE_URL}/rest/items/${itemName}/state`, {
        method: 'PUT',
        headers: {'Content-Type': 'text/plain'},
        body: command
    });
    if (!response.ok) throw new Error('Network response was not ok');
}

// Оновлення стану на сторінці
async function updateStates() {
    try {
        const temp = await getCurrentItemValue('LabTemperature');
        const humidity = await getCurrentItemValue('LabHumidity');
        const lampState = await getCurrentItemValue('LabLampState');

        const tempElem = document.querySelector('#temperature span');
        if (tempElem) tempElem.textContent = temp;

        const humidityElem = document.querySelector('#humidity span');
        if (humidityElem) humidityElem.textContent = humidity;

        const lampBtn = document.querySelector('#toggleLight');
        if (lampBtn) lampBtn.textContent = lampState === 'ON' ? 'Вимкнути освітлення' : 'Увімкнути освітлення';
    } catch (e) {
        console.error('Помилка отримання Item:', e);
    }
}

// Керування світлом
document.querySelector('#toggleLight').addEventListener('click', async () => {
    try {
        const state = await getCurrentItemValue('LabLampState');
        const newState = state === 'ON' ? 'OFF' : 'ON';

        // Відправляємо команду на LabLampCmd
        await sendCommand('LabLampCmd', newState);

        // Штучно оновлюємо LabLampState для емулятора
        await sendCommand('LabLampState', newState);

        updateStates();
    } catch (e) {
        console.error('Помилка керування світлом:', e);
    }
});

// Запуск оновлення кожну секунду
setInterval(updateStates, 1000);
updateStates();