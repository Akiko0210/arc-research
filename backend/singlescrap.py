from selenium import webdriver
from selenium.webdriver.common.by import By

# Initialize Chrome driver
driver = webdriver.Chrome()

# Open the webpage
driver.get("https://opg.optica.org/boe/fulltext.cfm?uri=boe-9-1-157")

# Find all <p> and <h2> elements
p_elements = driver.find_elements(By.TAG_NAME, 'p')
h2_elements = driver.find_elements(By.TAG_NAME, 'h2')

# Open a text file to write the extracted text
with open('extracted_text.txt', 'w', encoding='utf-8') as file:
    p_count = 0  # Initialize count for <p> elements
    # Write the text from each <p> element to the file
    for p in p_elements:
        file.write(p.text + '\n')
        p_count += 1  # Increment count for each <p> element
    # Write the text from each <h2> element to the file
    for h2 in h2_elements:
        file.write(h2.text + '\n')

print("Total <p> elements scraped:", p_count)
print("Text has been saved to 'extracted_text.txt'.")

# Close the browser
driver.quit()
