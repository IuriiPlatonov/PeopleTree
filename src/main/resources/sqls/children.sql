with recursive peopleTree as(
	select * from people 
    where p_id = :id
    union all
    select p.* from people p, peopleTree 
    where p.p_p_id = peopleTree.p_id)
select * from peopleTree