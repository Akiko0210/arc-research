import google.generativeai as genai
from apify_client import ApifyClient

# Initialize the ApifyClient with your API token
client = ApifyClient("apify_api_5UDWZrnbBgtcZTiwwDG61jpTri9WTk45i1Zb")

# Configure GenerativeAI API
genai.configure(api_key="AIzaSyD9FA8hc3p0AtaECPvjCxUdT6RCBMx8y4g")

# Set up the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 0,
    "max_output_tokens": 8192,
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro-latest", generation_config=generation_config, safety_settings=safety_settings
)

# Start the conversation
convo = model.start_chat(
    history=[
        {
            "role": "user",
            "parts": [
                "How does insect vision work? Compound Eyes, Simple Eyes, Polarized Light Detection, Image Formation and Processing combine these two and make the final prompt direct into the scholar search query."
            ],
        },
        {
            "role": "model",
            "parts": [
                "Okay, I can help with that! I'll provide information and supporting points in a checkbox format. You can select the points that interest you, and I'll elaborate on them. Just ask your questions, and we'll explore the topics together."
            ],
        },
    ]
)

# Initialize user input
user_input = ""

while user_input.lower() != "stop":
    # Prompt user for input
    user_input = input("You: ")

    # Send user's input to the model
    convo.send_message(user_input)

    # Get response from the model
    response = convo.last.text
    print("Model:", response)  # Print model's response after user's input

if user_input.lower() == "stop":
    # Generate prompt from the accumulated information
    user_input = "Generate a summary in one short sentence of what has been discovered in this chat. In general, just mention the important words. Don't use description, and add the topic inside the result but only list it like other important words."

    convo.send_message(user_input)
    final_response = convo.last.text
    print("Model:", final_response)  # Print final response

    # Use the final response as the keyword for the search
    run_input = {
        "keyword": final_response,
        "maxItems": 10,
        "filter": "all",
        "sortBy": "relevance",
        "articleType": "any",
        "proxyOptions": {
            "useApifyProxy": True,
        },
        "enableDebugDumps": False,
    }

    # Call the Actor with the final response as the keyword
    run = client.actor("kdjLO0hegCjr5Ejqp").call(run_input=run_input)
