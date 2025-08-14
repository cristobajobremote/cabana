-- Esquema de Base de Datos D1 para Cabaña Sol del Nevado
-- Tabla principal de reseñas

CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    guest_name TEXT NOT NULL,
    country TEXT NOT NULL,
    flag TEXT NOT NULL,
    rating REAL NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('booking', 'airbnb', 'direct')),
    stay_date TEXT, -- ISO date string
    stay_duration TEXT,
    guest_count INTEGER DEFAULT 1,
    host_response TEXT,
    photo_url TEXT,
    photo_key TEXT, -- R2 object key
    created_at TEXT NOT NULL, -- ISO datetime string
    updated_at TEXT NOT NULL, -- ISO datetime string
    is_active BOOLEAN DEFAULT 1,
    metadata TEXT -- JSON string para datos adicionales
);

-- Tabla para imágenes de huéspedes
CREATE TABLE IF NOT EXISTS guest_photos (
    id TEXT PRIMARY KEY,
    review_id TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    r2_key TEXT NOT NULL,
    url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    width INTEGER,
    height INTEGER,
    uploaded_at TEXT NOT NULL,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- Tabla para estadísticas (caché)
CREATE TABLE IF NOT EXISTS stats_cache (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Tabla para configuración del sistema
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TEXT NOT NULL
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_country ON reviews(country);
CREATE INDEX IF NOT EXISTS idx_reviews_active ON reviews(is_active);

-- Datos iniciales de configuración
INSERT OR REPLACE INTO system_config (key, value, description, updated_at) VALUES
('maintenance_mode', 'false', 'Modo mantenimiento del sistema', datetime('now')),
('max_reviews_per_page', '20', 'Número máximo de reseñas por página', datetime('now')),
('allow_guest_uploads', 'false', 'Permitir subida de fotos por huéspedes', datetime('now')),
('auto_approve_reviews', 'false', 'Aprobar reseñas automáticamente', datetime('now')),
('notification_email', 'contacto@cabanasoldelnevado.cl', 'Email para notificaciones', datetime('now'));

-- Vista para estadísticas en tiempo real
CREATE VIEW IF NOT EXISTS reviews_stats AS
SELECT 
    COUNT(*) as total_reviews,
    ROUND(AVG(rating), 1) as average_rating,
    COUNT(CASE WHEN platform = 'booking' THEN 1 END) as booking_reviews,
    COUNT(CASE WHEN platform = 'airbnb' THEN 1 END) as airbnb_reviews,
    COUNT(CASE WHEN platform = 'direct' THEN 1 END) as direct_reviews,
    COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_reviews,
    COUNT(CASE WHEN rating >= 4 THEN 1 END) as four_plus_reviews,
    COUNT(CASE WHEN photo_url IS NOT NULL THEN 1 END) as reviews_with_photos
FROM reviews 
WHERE is_active = 1;

-- Trigger para actualizar timestamp de modificación
CREATE TRIGGER IF NOT EXISTS update_reviews_timestamp
    AFTER UPDATE ON reviews
    FOR EACH ROW
BEGIN
    UPDATE reviews SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger para limpiar fotos cuando se elimina una reseña
CREATE TRIGGER IF NOT EXISTS cleanup_photos_on_review_delete
    AFTER DELETE ON reviews
    FOR EACH ROW
BEGIN
    DELETE FROM guest_photos WHERE review_id = OLD.id;
END; 