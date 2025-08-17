SELECT name, type
FROM sqlite_master
WHERE type IN ('table','view','index')
ORDER BY type, name;
