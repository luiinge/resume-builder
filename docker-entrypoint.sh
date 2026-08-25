#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding predefined templates (if not already present)..."
npx prisma db seed

exec "$@"
