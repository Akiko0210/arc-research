import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def clean_text(text):
    # Convert text to lowercase
    text = text.lower()
    
    # Remove punctuation
    text = re.sub(r'[^\w\s]', '', text)
    
    # Remove numbers
    text = re.sub(r'\d+', '', text)
    
    # Tokenize the text
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    
    # Join the tokens back into a single string
    cleaned_text = ' '.join(tokens)
    
    return cleaned_text

def clean_and_save_file(input_file_path, output_file_path):
    with open(input_file_path, "r", encoding="utf-8") as file:
        text = file.read()
    cleaned_text = clean_text(text)
    with open(output_file_path, "w", encoding="utf-8") as file:
        file.write(cleaned_text)

# Example usage:
input_file_path = "extracted_text.txt"
output_file_path = "cleaned_file.txt"
clean_and_save_file(input_file_path, output_file_path)