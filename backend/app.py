from fastapi import FastAPI, Request
from dotenv import load_dotenv
from google.genai import types
import os
from google import genai
#imports gemeni key
load_dotenv()

client = genai.Client(api_key=os.getenv("gemenikey"))

gemeniTest = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="explain traffic patterns in vancouver bc",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=0)
    ),
)

print(gemeniTest.text)