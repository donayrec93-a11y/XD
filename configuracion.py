import os

# Configuración base
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-only-change-me')
    DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'lavanderia.db')
    STATIC_FOLDER = 'static'
    TEMPLATES_FOLDER = 'templates'

# Configuración para desarrollo
class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

# Configuración para producción
class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    # En producción, asegúrate de establecer una SECRET_KEY segura como variable de entorno

# Configuración para pruebas
class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    DATABASE_PATH = ':memory:'

# Diccionario de configuraciones
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}