from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import os

# Set Chrome options for running in headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")

# Initialize Chrome driver with the specified options
driver = webdriver.Chrome(options=chrome_options)

# Create the data folder if it doesn't exist
data_folder = 'data'
if not os.path.exists(data_folder):
    os.makedirs(data_folder)

# Open the file containing the links
with open('links.txt', 'r') as f:
    # Iterate over each link
    for link in f:
        # Remove newline characters
        link = link.strip()
        # Open the webpage
        driver.get(link)
        
        # Check if the link is pointing to a PDF file
        if link.endswith('.pdf'):
            # Extract the filename from the URL
            file_name = link.split('/')[-1]
            # Download the PDF file into the data folder
            pdf_path = os.path.join(data_folder, file_name)
            with open(pdf_path, 'wb') as pdf_file:
                pdf_file.write(driver.find_element(By.TAG_NAME, 'body').screenshot_as_png)
            print("PDF file downloaded:", pdf_path)
        else:
            # Find all <p> and <h2> elements
            p_elements = driver.find_elements(By.TAG_NAME, 'p')
            h2_elements = driver.find_elements(By.TAG_NAME, 'h2')
            
            # Write the extracted text to a file in the data folder
            file_path = os.path.join(data_folder, f'{link.split("/")[-1].replace(".", "_")}_extracted_text.txt')
            with open(file_path, 'a', encoding='utf-8') as file:
                p_count = 0  # Initialize count for <p> elements
                # Write the text from each <p> element to the file
                for p in p_elements:
                    file.write(p.text + '\n')
                    p_count += 1  # Increment count for each <p> element
                # Write the text from each <h2> element to the file
                for h2 in h2_elements:
                    file.write(h2.text + '\n')
            
            print("Total <p> elements scraped from", link, ":", p_count)

# Close the browser
driver.quit()
