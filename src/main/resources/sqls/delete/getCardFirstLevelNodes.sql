select ws_id,
       user_id,
       card_id,
       null as card_set_id,
       null as element_identifier,
       null as pos_x,
       null as pos_y,
       null as pos_z,
       parent_id,
       null as value,
       null as height,
       null as width
from cards
where parent_id = :card_id