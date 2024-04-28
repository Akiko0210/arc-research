from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import glob
import time

import shutil

import os
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
CORS(app)
# Initialize the ApifyClient with your API token
client = ApifyClient("apify_api_5UDWZrnbBgtcZTiwwDG61jpTri9WTk45i1Zb")

chrome_options = Options()
chrome_options.add_argument("--headless")

driver = webdriver.Chrome(options=chrome_options)

# Configure GenerativeAI API
genai.configure(api_key="AIzaSyD2Ivwpf_Dsboq7nQfSyh1seVMdDkVNWP4")

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

links = []

# check if storage already exists
PERSIST_DIR = "./storage"
if not os.path.exists(PERSIST_DIR):
    # load the documents and create the index
    documents = SimpleDirectoryReader("data").load_data()
    good = VectorStoreIndex.from_documents(documents)
    # store it for later
    good.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    # load the existing index
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    good = load_index_from_storage(storage_context)

# Define a route for querying the index
@app.route('/query', methods=['POST'])
def query_index():
    query_string = request.json['query_string']  # assuming the query string is sent in JSON format
    query_engine = good.as_query_engine()
    response = query_engine.query(query_string)
    return str({'response': response})

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
            links = []


            # Fetch and append valid links from Actor results to the 'links' list
            for item in client.dataset(run["defaultDatasetId"]).iterate_items():
                # Extract documentLink
                document_link = item.get("documentLink", "")
                # Check if documentLink is not 'N/A'
                if document_link and document_link != "N/A":
                    links.append(document_link)

            # Output the valid links to a file
            
            scrape_websites(links)

            return jsonify({"message": "Search completed. Check your results!"})

        # Return model's response
        return jsonify({"response": response})

def scrape_websites(links):
    # Create the data folder if it doesn't exist
    data_folder = 'data'
    if not os.path.exists(data_folder):
        os.makedirs(data_folder)
    os.chdir(data_folder)
    
    # Initialize the WebDriver with the configured options
    driver = webdriver.Chrome(options=chrome_options)

    # Iterate over each link
    for link in links:
        # Remove newline characters
        link = link.strip()
        print("Scraping:", link)

        # Open the webpage
        driver.get(link)

        # Wait for the PDF to download
        time.sleep(1)  # Adjust the sleep time as needed

    # Quit the WebDriver session
    driver.quit()
    # shutil.move("*.pdf", "data")
    
    # data_directory = 'data'

# Ensure the data directory exists
    # if not os.path.exists(data_directory):
    #     os.makedirs(data_directory)

    # # Create the wildcard pattern to match PDF files
    # pdf_pattern = os.path.join(source_directory, '*.pdf')

    # # Get a list of PDF files matching the pattern
    # pdf_files = glob.glob(pdf_pattern)
    # print(pdf_files, "pdf_files")

    # # Move each PDF file to the data directory
    # for pdf_file in pdf_files:
    #     # Extract the filename from the full path
    #     file_name = os.path.basename(pdf_file)
        
    #     # Create the destination path in the data directory
    #     destination_path = os.path.join(data_directory, file_name)
        
    #     # Move the PDF file to the data directory
    #     shutil.move(pdf_file, destination_path)
    #     print(f"Moved {file_name} to {destination_path}")

        # Get the content type from the response headers
        # content_type = driver.execute_script("""
        #     var mimeTypes = window.navigator.mimeTypes;
        #     if (mimeTypes && mimeTypes.length > 0) {
        #         return mimeTypes[0].type;
        #     } else {
        #         return null;
        #     }
        # """)
        # print("content_type",content_type)

        # Check if the content type is a PDF
        # if content_type and 'pdf' in content_type.lower():
        #     # Extract the filename from the URL
        #     file_name = link.split('/')[-1]
        #     print("this is an pdf file: ", file_name)

        #     # Download the PDF file into the data folder
        #     pdf_path = os.path.join(data_folder, file_name)
        #     print(pdf_path,"pdf_path")
        #     with open(pdf_path, 'wb') as pdf_file:
        #         pdf_file.write(driver.find_element(By.TAG_NAME, 'body').screenshot_as_png)
        #     print("PDF file downloaded:", pdf_path)
        # else:
            # # Find all <p> and <h2> elements
            # p_elements = driver.find_elements(By.TAG_NAME, 'p')
            # h2_elements = driver.find_elements(By.TAG_NAME, 'h2')

            # # Write the extracted text to a file in the data folder
            # file_path = os.path.join(data_folder, f'{link.split("/")[-1].replace(".", "_")}_extracted_text.txt')
            # if os.path.exists(file_path):
            #     with open(file_path, 'w') as file:
            #         file.write("")

            # # Append the text of each element
            # with open(file_path, 'w', encoding='utf-8') as file:
            #     # Write the text from each <p> element to the file
            #     for p in p_elements:
            #         file.write(p.text + '\n')

            #     # Write the text from each <h2> element to the file
            #     for h2 in h2_elements:
            #         file.write(h2.text + '\n')

            # print("Text extracted from", link, "and saved to:", file_path)
            # pass
                
if __name__ == '__main__':
    app.run(debug=True)
