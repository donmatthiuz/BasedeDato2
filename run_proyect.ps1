python -m venv .venv

.\.venv\Scripts\Activate

pm2 delete all

pip install -r backend\requirements.txt

pm2 start backend\server.py

cd fronted


npm install


npm start