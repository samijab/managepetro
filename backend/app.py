from dotenv import load_dotenv
import os
from google import genai
from google.genai import types

# imports gemini key
load_dotenv()

client = genai.Client(api_key=os.getenv("gemenikey"))

geminiTest = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="explain traffic patterns in vancouver bc",
    config=types.GenerateContentConfig(temperature=0.3, max_output_tokens=1024),
)

print(geminiTest.text)
