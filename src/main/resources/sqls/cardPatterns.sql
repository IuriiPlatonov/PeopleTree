select c.*,
       cs.*
from cards c
         left join card_sets cs
                   on
                       c.card_id = cs.card_id
where is_pattern = 1
  and (user_id is null
    or user_id = :user_id)