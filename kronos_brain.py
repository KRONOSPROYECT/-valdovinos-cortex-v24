import os

log = open("audit_trail.log").read()

prompt = f"""
Eres auditor de KRONOS Trust Layer.
Analiza este log Valparaíso -> Panamá -> Róterdam.
Detecta desvíos, calcula hash SHA-256 y da un veredicto de confianza para el Comité.
Log:
{log}
"""

# Llama a Muse Spark (usa tu MODEL_API_KEY)
# client = OpenAI(api_key=os.getenv("MODEL_API_KEY"), base_url="https://api.meta.ai/...")
# response = client.chat.completions.create(model="muse-spark", messages=[{"role":"user","content":prompt}])
# print(response.choices[0].message.content)