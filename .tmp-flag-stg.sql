INSERT INTO system_config (key, value, description, updated_at)
VALUES ('__env__', 'staging', 'bandera de entorno', datetime('now'))
ON CONFLICT(key) DO UPDATE SET value='staging', updated_at=datetime('now');
