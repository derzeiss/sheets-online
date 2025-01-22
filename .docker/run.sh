docker run -d \
-e DATABASE_URL="file:/data/prod.db" \
-p 3002:3000 \
sheets-online
# -v prisma/dev.db:/data/dev.db \