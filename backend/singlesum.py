import google.generativeai as genai

genai.configure(api_key="AIzaSyD9FA8hc3p0AtaECPvjCxUdT6RCBMx8y4g")

# Set up the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

convo = model.start_chat(history=[
])

def read_text_from_file(file_path):
    with open(file_path, 'r') as file:
        return file.read()

# Read user paragraph from a .txt file
user_paragraph = read_text_from_file("extracted_text.txt")

def summarize_with_prompt(text_to_summarize, model):
  prompt = f"what's retina projection? and explain more of it to me. also use bullet points to highlight some important points {text_to_summarize}"
  summary = model.send_message(prompt)
  return summary


summary = summarize_with_prompt(user_paragraph, convo)

# Access the text content of the response
summary_text = summary.text

print(f"Summary of your paragraph: {summary_text}")