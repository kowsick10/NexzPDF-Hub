FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-headless \
    qpdf \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 nexpdf
USER nexpdf
WORKDIR /app

COPY --chown=nexpdf:nexpdf requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

COPY --chown=nexpdf:nexpdf . .

RUN mkdir -p /tmp/nexpdf/uploads /tmp/nexpdf/jobs

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
