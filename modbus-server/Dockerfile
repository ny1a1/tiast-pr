FROM python:3.10-slim

WORKDIR /app
COPY server.py requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 502
CMD ["python", "server.py"]