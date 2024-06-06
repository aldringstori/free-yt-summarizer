from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

def generate_text(prompt):
    print("prompt:{}".format(prompt))
    try:
        payload = {
            "model": "phi3",
            "prompt": f"summarize the text inside square brackets, split by topics, create a title for each topic and create a summary of each topic [{prompt}]",
            "stream": False
        }

        api_url = "http://localhost:11434/api/generate"  # Assuming phi3 ollama LLM is running on 11434
        response = requests.post(api_url, json=payload)

        if response.status_code == 200:
            responses = response.content.split(b'\n')
            generated_text = ''
            for obj in responses:
                if obj:
                    response_data = json.loads(obj.decode())
                    response = response_data.get("response")
                    if response:
                        if response.strip():
                            if response == " ":
                                generated_text += response
                            else:
                                if generated_text:
                                    generated_text += ' '
                                generated_text += response.strip()
            print(generated_text)
            return generated_text
        else:
            print(f"Error: Failed to generate text. Status code: {response.status_code}")
            return f"Error: {response.status_code}"
    except Exception as e:
        print(f"Error: {e}")
        return f"Error: {e}"

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text', '')
    summary = generate_text(text)
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(port=11435)  # Use a different port
