import urllib.request
from urllib.error import HTTPError, URLError
from information import scrape_paragraph
from search import fetch_top_search_results
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

if __name__ == "__main__":
    search_query = input("Enter your search query: ")
    top_results = list(fetch_top_search_results(search_query, num_results=10))  # Convert generator to list

    print("Top 10 search results:")
    for idx, result in enumerate(top_results, 1):
        print(f"{idx}. {result}")

    # Scrape and save article text for each result
    for idx, selected_result in enumerate(top_results, 1):
        print(f"Checking availability of article {idx}...")
        try:
            # Attempt to access the URL to check availability
            with urllib.request.urlopen(selected_result) as response:
                response_code = response.getcode()
                if response_code == 200:
                    print(f"Article {idx} is available for scraping. Scraping article...")
                    try:
                        article_text = scrape_paragraph(selected_result)
                        if article_text:  # If article text is not empty
                            # Save article text to a .txt file
                            file_name = f"article_{idx}.txt"
                            with open(file_name, "w", encoding="utf-8") as file:
                                file.write(article_text)
                            print(f"Article {idx} text saved to {file_name}")
                        else:
                            print(f"Article {idx} is not a text-based article.")
                    except Exception as e:
                        print(f"An unexpected error occurred while scraping article {idx}: {e}")
                else:
                    print(f"Article {idx} is not available (HTTP status code: {response_code}).")
        except (HTTPError, URLError) as e:
            print(f"Error checking availability of article {idx}: {e}")
