FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYGEOAPI_CONFIG=/app/pygeoapi.config.yml
ENV PYGEOAPI_OPENAPI=/app/pygeoapi.openapi.yml

EXPOSE 4100

CMD ["sh", "-c", "pygeoapi openapi generate $PYGEOAPI_CONFIG > $PYGEOAPI_OPENAPI && pygeoapi serve"]
