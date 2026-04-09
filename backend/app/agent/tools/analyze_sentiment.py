import json
import logging
from typing import Dict, Any
from app.services.groq_service import call_groq
from app.agent.prompts import SENTIMENT_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


async def analyze_sentiment_tool(
    interaction_notes: str,
) -> Dict[str, Any]:
    """
    Analyze HCP sentiment from interaction notes using Groq.
    Returns sentiment label, confidence score, and reasoning.
    """
    try:
        raw_response = await call_groq(
            system_prompt=SENTIMENT_SYSTEM_PROMPT,
            user_message=f"Analyze the HCP sentiment from these interaction notes:\n{interaction_notes}",
        )

        clean = raw_response.strip()
        if clean.startswith("```"):
            lines = clean.split("\n")
            clean = "\n".join(lines[1:-1]) if len(lines) > 2 else clean

        sentiment_data = json.loads(clean)

        required_keys = ["sentiment", "confidence", "reasoning", "key_indicators"]
        for key in required_keys:
            if key not in sentiment_data:
                if key == "sentiment":
                    sentiment_data[key] = "Neutral"
                elif key == "confidence":
                    sentiment_data[key] = 0.5
                elif key == "reasoning":
                    sentiment_data[key] = "Unable to determine sentiment clearly."
                elif key == "key_indicators":
                    sentiment_data[key] = []

        valid_sentiments = ["Positive", "Neutral", "Negative"]
        if sentiment_data["sentiment"] not in valid_sentiments:
            sentiment_data["sentiment"] = "Neutral"

        confidence = float(sentiment_data["confidence"])
        sentiment_data["confidence"] = max(0.0, min(1.0, confidence))

        return {
            "success": True,
            "data": sentiment_data,
            "message": f"Sentiment analyzed: {sentiment_data['sentiment']} (confidence: {sentiment_data['confidence']:.0%})",
        }

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in analyze_sentiment: {e}")
        return {
            "success": True,
            "data": {
                "sentiment": "Neutral",
                "confidence": 0.5,
                "reasoning": "Could not analyze sentiment from provided notes.",
                "key_indicators": [],
            },
            "message": "Sentiment analysis returned neutral (parse error).",
        }
    except Exception as e:
        logger.error(f"Error in analyze_sentiment tool: {e}")
        return {
            "success": False,
            "data": {},
            "message": f"Error analyzing sentiment: {str(e)}",
        }
