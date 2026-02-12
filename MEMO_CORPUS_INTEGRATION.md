# Memo integrazione corpus (newsletter + notes)

Regola editoriale da mantenere nei prossimi update del libro:

1. Per ogni subcapitolo (`FF.x.y`) aggiungere almeno un innesto da `notes.json` con:
   - frase breve nel testo già presente;
   - link esplicito alla fonte (`url` della nota);
   - formulazione senza inferenze non presenti nella nota.

2. Ogni nuovo paragrafo integrato deve evidenziare **2 info chiave** con struttura fissa:
   - `Info chiave 1:`
   - `Info chiave 2:`

3. Contenuto consentito:
   - solo materiale da corpus newsletter e note;
   - evitare aggiunte speculative o non verificabili.

4. Gestione link FF:
   - se manca un link specifico `FF.x.y`, usare il parent `FF.x`.

5. Subcapitoli futuri:
   - ogni espansione deve aggiungere riferimenti tracciabili (fonte + FF);
   - preferire inserimento dentro paragrafi esistenti, non blocchi scollegati.

6. EPUB workflow:
   - aggiornare prima HTML/capitoli e caption immagini da corpus;
   - rigenerare EPUB solo a richiesta esplicita di publish.
