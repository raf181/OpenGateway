# GeoCustody Backend Container
FROM python:3.12-slim

# ── Create a non-root user before any other step ─────────────────────────────
RUN groupadd --system --gid 1001 appgroup \
 && useradd  --system --uid 1001 --gid appgroup \
             --no-create-home --shell /bin/false appuser

WORKDIR /app

# ── Install Python deps (gcc needed to compile some wheels) then remove it ───
COPY backend/requirements.txt .
RUN apt-get update \
 && apt-get install -y --no-install-recommends gcc \
 && pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt \
 && apt-get purge -y --auto-remove gcc \
 && rm -rf /var/lib/apt/lists/*

# ── Copy application source ───────────────────────────────────────────────────
COPY backend/ .

# ── Create data directory and hand ownership to the non-root user ─────────────
RUN mkdir -p /app/data \
 && chown -R appuser:appgroup /app

# ── Drop privileges ───────────────────────────────────────────────────────────
USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
