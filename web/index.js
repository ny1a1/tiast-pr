const BASE_URL = 'http://localhost:8080';

// Отримати поточний стан Item
async function getCurrentItemValue(itemName) {
    const response = await fetch(`${BASE_URL}/rest/items/${itemName}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.state;
}

// Оновити стан Number Item
function updateItemState(itemName, value) {
    fetch(`${BASE_URL}/rest/items/${itemName}/state`, {
        method: 'PUT',
        headers: {'Content-Type': 'text/plain'},
        body: value.toString()
    }).then(r => {
        if (!r.ok) throw new Error('Network response was not ok');
    }).catch(e => console.error('Помилка відправки команди:', e));
}

// Оновлення стану на сторінці
async function updateStates() {
    try {
        const temp = await getCurrentItemValue('VirtualTemperature');
        const humidity = await getCurrentItemValue('VirtualHumidity');

        const tempElem = document.querySelector('#temperature span');
        if (tempElem) tempElem.textContent = temp;

        const humidityElem = document.querySelector('#humidity span');
        if (humidityElem) humidityElem.textContent = humidity;

    } catch (e) {
        console.error('Помилка отримання Item:', e);
    }
}

// Керування світлом
document.querySelector('#toggleLight').addEventListener('click', async () => {
    try {
        const state = await getCurrentItemValue('myLightSwitch');
        const newState = state === 'ON' ? 'OFF' : 'ON';

        fetch(`${BASE_URL}/rest/items/myLightSwitch`, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            body: newState
        });
    } catch (e) {
        console.error('Помилка керування світлом:', e);
    }
});

// Запуск оновлення кожну секунду
setInterval(updateStates, 1000);
updateStates();