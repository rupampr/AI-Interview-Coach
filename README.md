
## Environment Variables

**Backend** (`backend/.env`, see `.env.example`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET_KEY` | Secret used to sign JWTs — use a long random value in production |
| `ENVIRONMENT` | `development` or `production` |

**Frontend** (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the deployed/local backend |

## Deployment

- **Backend + Postgres**: deployed on [Railway](https://railway.app) — connects directly to the repo's `backend/Dockerfile`, with a managed Postgres add-on.
- **Frontend**: deployed on [Vercel](https://vercel.com) — connects to the repo, root directory set to `frontend/`.

Remember to:
1. Set `NEXT_PUBLIC_API_URL` in Vercel to your Railway backend URL
2. Update the `CORSMiddleware` `allow_origins` in `app/main.py` to your Vercel URL
3. Never commit real secrets — set `JWT_SECRET_KEY` and `DATABASE_URL` in Railway's dashboard, not in code

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create a new user |
| `POST` | `/auth/login` | Log in, returns a JWT |
| `GET` | `/auth/me` | Get current logged-in user |
| `POST` | `/resume/upload` | Upload and parse a resume PDF |

Full interactive docs available at `/docs` on the running backend.

## Roadmap

- [x] Auth (register/login/JWT)
- [x] Resume upload + text extraction
- [ ] Structured data extraction (skills/education/experience)
- [ ] Job description analysis
- [ ] Semantic resume-JD matching (embeddings)
- [ ] LLM-based interview question generation
- [ ] AI answer evaluation
- [ ] Voice mode
- [ ] Progress dashboard

## License

MIT