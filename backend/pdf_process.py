from pathlib import Path

from llama_index.readers.file import PyMuPDFReader

loader = PyMuPDFReader()
documents = loader.load_data(file_path=Path("./test.pdf"), metadata=True)