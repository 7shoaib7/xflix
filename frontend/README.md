# XFlix frontend

React app for browsing, watching and uploading XFlix videos.

```bash
npm install
npm start          # dev server on http://localhost:3000
npm run build      # production build in ./build
```

The API base URL defaults to `https://xflix-2.onrender.com/v1`. To use another backend, set
`REACT_APP_API_URL` before `npm start` or `npm run build`.

Netlify: set the base directory to `frontend`; build settings come from `netlify.toml`.
