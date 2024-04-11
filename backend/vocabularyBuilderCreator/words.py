import ssl
import os
import nltk

def getWord():
    try:
        _create_unverified_https_context = ssl._create_unverified_context
    except AttributeError:
        pass
    else:
        ssl._create_default_https_context = _create_unverified_https_context

    download_dir = '../../database/nltk_data'

    if not os.path.exists(download_dir):
        # If the directory doesn't exist, create it
        os.makedirs(download_dir)

    nltk.download('words', download_dir=download_dir)
 
    print(nltk.data.path)