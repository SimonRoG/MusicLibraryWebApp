FROM python:3.12-alpine

WORKDIR /backend
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

CMD ["sh", "-c", "sleep 5 && python data/seed.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
