import extract_msg

def extract_email(path):

    msg = extract_msg.Message(path)

    text = ""

    text += msg.subject + "\n"

    text += msg.body

    return text, "Email Parser"