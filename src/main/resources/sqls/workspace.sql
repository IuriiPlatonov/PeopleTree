select
	w.*,
	cs.*,
    null as parent_id
from
	workspaces w
left join card_sets cs
on
	w.card_id = cs.card_id
where
	w.user_id = :user_id