import easyocr

# reader = easyocr.Reader(["en"])
reader = None

def get_reader():
    global reader

    if reader is None:
        reader = easyocr.Reader(["en"])

    return reader



def extract_image(image_path):
    reader = get_reader()

    result = reader.readtext(image_path)

    text = ""

    for item in result:

        text += item[1] + "\n"

    return text, "OCR Parser"