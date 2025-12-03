FROM python:3.13-slim

WORKDIR /app
COPY mistral_forecast.py .

RUN pip install requests

CMD ["python", "mistral_forecast.py"]