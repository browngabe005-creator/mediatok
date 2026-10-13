from pathlib import Path
html=Path('public/index.html').read_text()
worker=Path('src/worker.js').read_text()
assert '<h3 style="margin:0">Global</h3>' in html
assert "state.me?'Your collection':'Track everything'" not in html
assert 'function catalogDisplaySrc' in html
assert 'catalogDisplaySrc(src)' in html
assert 'catalogDisplaySrc(cover)' in html
assert 'if(type==="tv")' in worker
assert 'entity=movie&limit=20' in worker
assert 'book-pic.webnovel.com' in worker
assert 'version:"v74"' in worker
print('v74 checks passed')
