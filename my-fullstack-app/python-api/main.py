from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Create a FastAPI instance - this is the "app" that Uvicorn looks for
app = FastAPI(title="Python Greeting API")

class GreetingInput(BaseModel):
    name: str

@app.post("/greet")
def greet_name(input: GreetingInput):
    """
    Greets the provided name.
    """
    if not input.name:
        raise HTTPException(status_code=400, detail="Name cannot be empty.")
    
    return {"message": f"Hello, {input.name} from Python FastAPI!"}

@app.get("/health")
def health_check():
    """
    Health check endpoint for the Python API.
    """
    return {"status": "Python API is healthy"}