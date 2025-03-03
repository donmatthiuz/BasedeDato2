python -m venv .venv

.\.venv\Scripts\Activate

pm2 delete all

pip install -r proyecto1\requirements.txt

pm2 start proyecto1\server.py

cd fronted


npm install


npm start