# Editorial compliance checklist (FF-book)

Mandatory checks for any PR touching `book/` chapter pages:

- [ ] remove note/raw style passages (`TODO`, `RAW`, `bozza`, `draft`, `[[...]]`)
- [ ] linked claim text length <= 15 words (`.fc` labels)
- [ ] Search section present
- [ ] last-updated timestamp present
- [ ] reading-time estimate present
- [ ] reference count present

## Local verification

Run:

```bash
python3 book/tools/editorial_compliance_check.py
```

Expected output: all chapter files reported as `OK`.
