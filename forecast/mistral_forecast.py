import requests
import json
import re
import time
import os

BASE_URL = "http://openhab:8080/rest/items"
OPENHAB_TOKEN = os.getenv("OPENHAB_TOKEN")
MISTRAL_TOKEN = os.getenv("MISTRAL_TOKEN")
MISTRAL_MODEL = "mistral-small"
MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions"

def get_item_state(item_name):
    r = requests.get(f"{BASE_URL}/{item_name}/state",
                     headers={"Authorization": f"Bearer {OPENHAB_TOKEN}"})
    r.raise_for_status()
    return r.text

def update_item(item_name, value):
    r = requests.post(f"{BASE_URL}/{item_name}",
                      headers={
                          "Content-Type": "text/plain",
                          "Authorization": f"Bearer {OPENHAB_TOKEN}"
                      },
                      data=str(value))
    r.raise_for_status()

def get_forecast(temp, hum):
    prompt = (
        f"Температура: {temp} °C, Вологість: {hum} %. "
        "Спрогнозуй значення на наступну годину у форматі JSON: "
        "{\"temp\": <число>, \"hum\": <число>, \"rec\": \"коротка порада\"}"
    )

    headers = {
        "Authorization": f"Bearer {MISTRAL_TOKEN}",
        "Content-Type": "application/json"
    }

    body = {
        "model": MISTRAL_MODEL,
        "messages": [{"role": "user", "content": prompt}]
    }

    r = requests.post(MISTRAL_URL, headers=headers, json=body)
    r.raise_for_status()
    content = r.json()["choices"][0]["message"]["content"]
    print("Mistral response raw:", content)

    match = re.search(r"\{.*\}", content, re.DOTALL)
    if match:
        forecast = json.loads(match.group(0))
    else:
        forecast = {"temp": temp, "hum": hum, "rec": "Немає прогнозу"}

    return forecast

if __name__ == "__main__":
    while True:
        time.sleep(20)
        temp = get_item_state("GreenhouseTemperature")
        hum  = get_item_state("GreenhouseHumidity")
        
        forecast = get_forecast(temp, hum)

        update_item("PredictedTemperature", forecast["temp"])
        update_item("PredictedHumidity", forecast["hum"])
        update_item("AiRecommendation", forecast["rec"])

        print("Прогноз:", forecast)
        time.sleep(300)