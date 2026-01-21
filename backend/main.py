from fastapi import FastAPI

app = FastAPI()


@app.get("/api/message")
def read_root():
    return {"message": "Hello, World!"}
