from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from app.config.env import env
import os
from typing import Optional
import json

router = APIRouter(prefix="/sentence-stage", tags=["sentence-stage"])
client = OpenAI(api_key=env.openai_api_key)


class SentenceCheckRequest(BaseModel):
    word: str
    sentence: str


class SentenceCheckResponse(BaseModel):
    isCorrect: bool
    correctUsage: Optional[str]
    message: str


def clean_json_response(json_string: str):
    try:
        return json.loads(json_string)
    except:
        # Clean up common JSON formatting issues
        cleaned = json_string.replace("\\n", "\n")
        cleaned = cleaned.replace('\\"', '"')
        cleaned = cleaned.replace("\\", "")
        return json.loads(cleaned)


@router.post("/check-sentence", response_model=SentenceCheckResponse)
async def check_sentence(request: SentenceCheckRequest):
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are a helpful assistant designed to output JSON.
                    Make sure your response does not include any extra characters.
                    The response should easily parse to JSON.

                    You are part of a word learning app. You will be given a word below,
                    and a sentence using that word. You determine the correct usage of the word in the
                    sentence provided.

                    The JSON response format should be this type declaration:

                    {
                      "isCorrect": boolean;
                      "correctUsage": string;
                      "message": string;
                    }

                    The message field should include a general message about the user's usage even if it was correct.
                    """,
                },
                {
                    "role": "user",
                    "content": f"""
                    Current Word: {request.word}
                    Current Sentence: {request.sentence}
                    """,
                },
            ],
            model="gpt-4o",
            response_format={"type": "json_object"},
            max_tokens=150,
        )

        json_response = clean_json_response(response.choices[0].message.content)
        return json_response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
