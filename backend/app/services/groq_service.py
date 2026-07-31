import json

from groq import Groq

from app.core.config import settings
from app.core.logger import logger
from app.schemas.groq_schema import GroqAnalysisResult


class GroqService:

    def __init__(self):
        self.client = Groq(
            api_key=settings.groq_api_key
        )

    def analyze_financial_report(self, report_text: str) -> GroqAnalysisResult:
        try:
            logger.info("Starting Groq financial analysis...")

            prompt = f"""
You are a senior financial analyst.

Analyze the following annual report and return ONLY valid JSON.

Rules:
1. Return ONLY valid JSON.
2. Do not include markdown.
3. Do not include explanations.
4. Keep each field concise (2-4 sentences).

Required JSON format:

{{
    "company_overview": "",
    "revenue_analysis": "",
    "profitability": "",
    "risks": "",
    "investment_recommendation": "",
    "overall_rating": 8
}}

Annual Report:

{report_text[:12000]}
"""

            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            content = response.choices[0].message.content

            logger.info("Groq response received.")

            data = json.loads(content)

            result = GroqAnalysisResult.model_validate(data)

            logger.info("Financial analysis completed successfully.")

            return result

        except json.JSONDecodeError:
            logger.exception("Invalid JSON returned by Groq.")
            raise

        except Exception:
            logger.exception("Groq financial analysis failed.")
            raise