from apify_client import ApifyClient

# Initialize the ApifyClient with your API token
client = ApifyClient("apify_api_5UDWZrnbBgtcZTiwwDG61jpTri9WTk45i1Zb")

# Prepare the Actor input
run_input = {
    "keyword": "what's retina projection?",
    "maxItems": 10,
    "filter": "all",
    "sortBy": "relevance",
    "articleType": "any",
    "proxyOptions": {
        "useApifyProxy": True,
    },
    "enableDebugDumps": False,
}

# Run the Actor and wait for it to finish
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
with open('links.txt', 'w') as f:
    for link in links:
        f.write("%s\n" % link)
