import pandas as pd

def extract_excel(path):

    sheets = pd.read_excel(
        path,
        sheet_name=None
    )

    text = ""

    for sheet, df in sheets.items():

        text += f"\nSheet: {sheet}\n"

        text += df.to_string()

    return text, "Excel Parser"