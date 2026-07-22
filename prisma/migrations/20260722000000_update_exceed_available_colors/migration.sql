UPDATE inventory_items
SET
  display_color = 'Aurora Green',
  color_id = (
    SELECT aurora.id
    FROM colors AS aurora
    JOIN models AS model
      ON model.id = aurora.model_id
    WHERE model.slug = 'exceed-standard'
      AND aurora.slug = 'aurora-green'
    LIMIT 1
  )
WHERE model_id = (
    SELECT id
    FROM models
    WHERE slug = 'exceed-standard'
    LIMIT 1
  )
  AND (
    display_color = 'Ice Lake Blue'
    OR color_id = (
      SELECT ice.id
      FROM colors AS ice
      JOIN models AS model
        ON model.id = ice.model_id
      WHERE model.slug = 'exceed-standard'
        AND ice.slug = 'ice-lake-blue'
      LIMIT 1
    )
  );
