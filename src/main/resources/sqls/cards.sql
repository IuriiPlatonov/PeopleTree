select c.*, cs.*
from cards c
         left join card_sets cs
                   on c.card_id = cs.card_id
where c.ws_id = :ws_id