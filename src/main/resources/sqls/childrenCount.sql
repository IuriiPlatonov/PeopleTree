with recursive cardTree as(
    select card_id from cards
    where card_id = :id
    union all
    select c.card_id from cards c, cardTree ct
    where c.parent_id = ct.card_id)
select * from cardTree