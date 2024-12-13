# SvelteKit takehome

## run locally

```bash
npm install
npm run dev
```

You may need to go to `svelte.config.js` and change the `adapter` to `adapter-node` if you want to run it locally.

if running both the FastAPI server locally, set the `VITE_FAST_API_BASE_URL` to `http://localhost:8000` in `.env`.

else, set the `VITE_FAST_API_BASE_URL` to the production URL in `.env`. 
currently running on https://fastapi-be-un35.onrender.com

## hosted on netlify

https://piq-energy.netlify.app/

### pitfalls :(

- spent too many hours trying to figure out docker compose in conjunction with fastapi and sveltekit. not too much documentation. I should've started off project with docker compose. good lesson for next time!
- sveltekit ecosystem is not as mature as react. lots of workarounds.