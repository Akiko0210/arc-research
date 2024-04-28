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

# Start the conversation
convo = model.start_chat(history=[
  {
    "role": "user",
    "parts": ["this LLM helps users to think through like adding some support points as a check box and if the user selects them you're going to provide more information about that. for all the following questions. generate a prompt that includes all the information that the user is interested to know."]
  },
  {
    "role": "model",
    "parts": ["Okay, I can help with that! I'll provide information and supporting points in a checkbox format. You can select the points that interest you, and I'll elaborate on them. Just ask your questions, and we'll explore the topics together."]
  },
])

# Initialize user input
user_input = ""

# Continue the conversation until the user decides to stop
while user_input.lower() != "stop":
    # Prompt user for input
    user_input = input("You: ")

    # Send user's input to the model
    convo.send_message(user_input)

    # Get response from the model
    response = convo.last.text
    print("Model:", response)  # Print model's response after user's input

# Generate prompt from the accumulated information
prompt = convo.last.text
print("Generated Prompt:", prompt)