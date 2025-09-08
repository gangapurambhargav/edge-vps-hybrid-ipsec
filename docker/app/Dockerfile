FROM python:3.11-slim
WORKDIR /app
COPY docker/app/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY docker/app/app.py app.py
EXPOSE 8080
ENV PORT=8080
CMD ["python", "app.py"]

