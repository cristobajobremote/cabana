INSERT INTO reviews (
  id, guest_name, country, flag, rating, review_text, platform, stay_date,
  created_at, updated_at
)
VALUES (
  'test-1','Juan Pérez','Chile','🇨🇱',5,'Excelente estadía','booking','2025-08-10',
  datetime('now'), datetime('now')
);
SELECT id, created_at, updated_at FROM reviews WHERE id='test-1';
