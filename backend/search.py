from googlesearch import search

def fetch_top_search_results(query, num_results=10):
    search_results = search(query, num_results=num_results)
    return search_results
    

if __name__ == "__main__":
    search_query = input("Enter your search query: ")
    top_results = fetch_top_search_results(search_query, num_results=10)

    print("Top 10 search results:")
    for idx, result in enumerate(top_results, 1):
        print(f"{idx}. {result}")