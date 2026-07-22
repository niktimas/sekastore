DELETE FROM leads
WHERE model_id IN (
  SELECT id
  FROM models
  WHERE slug = 'exceed-rdc'
);

DELETE FROM inventory_items
WHERE model_id IN (
  SELECT id
  FROM models
  WHERE slug = 'exceed-rdc'
);

DELETE FROM media_assets
WHERE model_id IN (
  SELECT id
  FROM models
  WHERE slug = 'exceed-rdc'
)
OR color_id IN (
  SELECT colors.id
  FROM colors
  JOIN models ON models.id = colors.model_id
  WHERE models.slug = 'exceed-rdc'
);

DELETE FROM models
WHERE slug = 'exceed-rdc';
