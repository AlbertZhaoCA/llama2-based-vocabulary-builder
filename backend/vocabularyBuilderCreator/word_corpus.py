from nltk.corpus import words
import nltk
from words import download_dir
from words import getWord

getWord()

# Set the NLTK data directory (replace 'path_to_nltk_data' with the actual path)
nltk.data.path.append(download_dir)

# Now you can use the 'words' corpus
word_list = words.words()
print(f"The word list contains {len(word_list)} words.")
