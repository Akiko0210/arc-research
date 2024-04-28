from flask import Flask, request, jsonify, render_template
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)
import os.path

app = Flask(__name__)

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
# Define a route for querying the index
@app.route('/query', methods=['POST'])
def query_index():
    query_string = request.json['query_string']  # assuming the query string is sent in JSON format
    query_engine = index.as_query_engine()
    response = query_engine.query(query_string)
    return str({'response': response})

if __name__ == '__main__':
    app.run(debug=True)
