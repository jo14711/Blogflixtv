import requests
import json
import os

API_KEY = os.getenv("API_FOOTBALL_KEY")
headers = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
}

# Exemplo usando Brasileirão Série A (ID fictício para exemplo)
url = "https://v3.football.api-sports.io/standings?league=71&season=2024"
response = requests.get(url, headers=headers)
dados = response.json()

times = []
for team in dados['response'][0]['league']['standings'][0]:
    nome = team['team']['name']
    pontos = team['points']
    porcentagem = min(100, max(1, pontos))  # Exemplo simples
    times.append({ "time": nome, "porcentagem": porcentagem })

with open("dados.json", "w", encoding='utf-8') as f:
    json.dump(times, f, ensure_ascii=False, indent=2)
