from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from flask_cors import CORS
from apify_client import ApifyClient
import os.path
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)



app = Flask(__name__)
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

# check if storage already exists
PERSIST_DIR = "./storage"
if not os.path.exists(PERSIST_DIR):
    # load the documents and create the index
    documents = SimpleDirectoryReader("data").load_data()
    index = VectorStoreIndex.from_documents(documents)
    # store it for later
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/firstprocess')
def index():
    return render_template('chat.html')

@app.route('/chat', methods=['POST'])
def chat():
    # Start the conversation
    convo = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    request.form['user_input']
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

    while True:
        # Get user input from the HTML form
        user_input = request.form['user_input']
        
        # Send user's input to the model
        convo.send_message(user_input)

        # Get response from the model
        response = convo.last.text

        if user_input.lower() == "stop":
            # Generate prompt from the accumulated information
            user_input = "Generate a summary in one short sentence of what has been discovered in this chat. In general, just mention the important words. Don't use description, and add the topic inside the result but only list it like other important words."
            
            convo.send_message(user_input)
            final_response = convo.last.text

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
            
            # Process the response from Apify
            # Here you can handle the response and pass it to the HTML template
            # For simplicity, let's just return a JSON response
            return jsonify({"message": "Search completed. Check your results!"})

        # Return model's response
        return jsonify({"response": response})

# Define a route for querying the index
@app.route('/query', methods=['POST'])
def query_index():
    query_string = request.json['query_string']  # assuming the query string is sent in JSON format
    query_engine = index.as_query_engine()
    response = query_engine.query(query_string)
    return str({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
