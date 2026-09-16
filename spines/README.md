# custom spines

Drop a photo of a book's spine here as `<isbn>.jpg` (or `.png`, then set `"spine": "spines/<isbn>.png"`
on the book in books.json). The shelf uses it as-is: no title or author is drawn over it, and the
book's width follows the image's proportions. Any book without a file here gets the generated spine.

Fronts work the same way in `covers/<isbn>.jpg`. fetch-covers.py only downloads a cover when that
file is missing, so a photo you put there is never replaced.

A book can also point anywhere explicitly: `"cover": "…", "spine": "…"` in books.json.
