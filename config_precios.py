# Configuración de precios para la lavandería
# Versión optimizada para web

# Precios base (ajustables desde panel de administración)
PRECIO_KILO = 3.5
PRECIO_EDREDON = 15.0
PRECIO_TERNO = 20.0

# Recargos por tipo de servicio
RECARGO_SERVICIO = {
    "normal": 0.0,    # Servicio estándar sin recargo
    "seco": 2.0,      # Limpieza en seco
    "mano": 1.5,      # Lavado a mano
}

# Recargo por perfumado
RECARGO_PERFUMADO = 0.5

# Configuración de promociones (días específicos)
PROMOCIONES = {
    "martes": {
        "descripcion": "Martes: perfumado GRATIS en lavados por kilo",
        "perfumado_gratis": True,
    },
    # Puedes agregar más días con diferentes promociones
}

# Configuración para la web
WEB_CONFIG = {
    "nombre_negocio": "Lavandería RÍOS",
    "slogan": "Ropa limpia, clientes felices",
    "direccion": "Tu calle #123, Huánuco",
    "whatsapp": "51999999999",  # Cambia por tu número real
    "horario": "Lun-Sáb: 8am-7pm, Dom: 9am-1pm",
    "meta_description": "Servicio profesional de lavandería en Huánuco. Ofrecemos lavado por kilo, limpieza de edredones, ternos y más.",
    "keywords": "lavandería, ropa limpia, lavado por kilo, edredones, ternos, Huánuco",
}

# Función para obtener la promoción del día actual
def get_promocion_dia(dia_semana=None):
    """
    Obtiene la promoción para un día específico o para el día actual
    :param dia_semana: Nombre del día en minúsculas (lunes, martes, etc.) o None para día actual
    :return: Diccionario con la promoción o None si no hay promoción
    """
    import datetime
    if dia_semana is None:
        # Obtener el día actual en español
        dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
        dia_semana = dias[datetime.datetime.now().weekday()]
    
    return PROMOCIONES.get(dia_semana)