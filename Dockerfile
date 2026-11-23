FROM node:22.13.1-alpine3.20 AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build
# Build args (NEXT_PUBLIC_*) are inlined into client JS by Next.js, so
# they are public by design and safe to bake in.
#
# DATABASE_URL is required at build time because ~489 pages use
# getStaticProps to query Postgres, but is mounted as a BuildKit secret
# rather than passed as a --build-arg. It exists only on the temporary
# secret tmpfs inside this RUN step and is never written to any image
# layer — `docker history` will not reveal it.
#
# All other runtime secrets (JWT_SECRET, RESEND_API_KEY,
# TURNSTILE_SECRET_KEY, CRON_SECRET, S3_*) are loaded at container start
# by compose (env_file /root/secrets/bcl.env). The build secret is that same
# file (deploy/deploy.sh); only DATABASE_URL is read from it here.
COPY . .
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_APP_URL
# Redesign stages (lib/redesign.ts). Unset on the live site; "all" on the preview.
ARG NEXT_PUBLIC_REDESIGN=""
ENV NEXT_PUBLIC_REDESIGN=$NEXT_PUBLIC_REDESIGN
RUN --mount=type=secret,id=bcl_env,required=true \
    DATABASE_URL="$(sed -n 's/^DATABASE_URL=//p' /run/secrets/bcl_env)" \
    npm run build

# Production
FROM node:22.13.1-alpine3.20 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public
COPY --from=base /app/data ./data

EXPOSE 3000
CMD ["node", "server.js"]
