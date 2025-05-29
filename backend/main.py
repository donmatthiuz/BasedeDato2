from fastapi import FastAPI
from routes.pieza_routes import router as pieza_router
from routes.sugerencia_routes import router as sugerencia_router
from routes.resumen_routes import router as resumen_router

app = FastAPI(
    title="API de Ensamblaje de Rompecabezas",
    version="1.0.0",
    description="Sistema inteligente de conexión de piezas en Neo4j"
)

# Registrar rutas
app.include_router(pieza_router, tags=["Piezas"])
app.include_router(sugerencia_router, tags=["Sugerencias"])
app.include_router(resumen_router, tags=["Resumen"])

@app.get("/")
def root():
    return {"mensaje": "API de rompecabezas en ejecución"}
