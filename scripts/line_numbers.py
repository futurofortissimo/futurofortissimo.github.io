import csv

# Il nome del file CSV di input
input_csv_filename = '../index_files/notes_ff_michele_merelli_2024_futuro_fortissimo.csv'
# Il nome del file CSV di output
output_csv_filename = 'numbered_notes.csv'


def line_has_number_tag(row):
    """Controlla se l'ultimo elemento della riga segue il formato #NUMERO."""
    if row:
        last_element = row[-1]
        if last_element.startswith("#") and last_element[1:].isdigit():
            return True
    return False

# Apre il file CSV di input per la lettura e il file CSV di output per la scrittura
with open(input_csv_filename, mode='r', encoding='utf-8') as infile, open(output_csv_filename, mode='w', encoding='utf-8', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    # Legge ogni riga dal file di input
    for line_number, row in enumerate(reader, start=1):
        # Se l'ultimo elemento della riga non è un numero di linea, aggiungi il numero di linea
        if not line_has_number_tag(row):
            modified_row = row + [f"#{line_number}"]
        else:
            modified_row = row
        # Scrive la riga modificata nel file di output
        writer.writerow(modified_row)

print(f"File salvato come '{output_csv_filename}' con i numeri di linea aggiunti (se necessario).")
