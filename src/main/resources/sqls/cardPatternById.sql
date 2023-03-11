select cs.*,
       null as ws_id,
       null as user_id,
       null as parent_id
from card_sets cs
where card_id = :card_id