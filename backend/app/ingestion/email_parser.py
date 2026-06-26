import extract_msg

from email import policy
from email.parser import BytesParser


def extract_msg_email(path):

    msg = extract_msg.Message(path)

    text = ""

    text += (msg.subject or "") + "\n"

    text += (msg.body or "")

    return text, "MSG Email Parser"



def extract_eml_email(path):

    with open(path, "rb") as f:

        msg = BytesParser(policy=policy.default).parse(f)

    text = ""

    subject = msg["subject"]

    if subject:

        text += subject + "\n"

    body = ""

    if msg.is_multipart():

        for part in msg.walk():

            if part.get_content_type() == "text/plain":

                body += part.get_content()

    else:

        body = msg.get_content()

    text += body

    return text, "EML Email Parser"