with rootId as (
    with recursive rootPerson as(
		select p_id, p_p_id from people where p_id = :id
    	union all
    	select p.p_id, p.p_p_id from people p, rootPerson where p.p_id = rootPerson.p_p_id)    
    select * from rootPerson where p_p_id is null),
peopleByRootPerson as(
	with recursive peopleTree as(
	select * from people 
    where p_id = (select p_id from rootId)
    union all
    select p.* from people p, peopleTree 
    where p.p_p_id = peopleTree.p_id)
select * from peopleTree)
select * from peopleByRootPerson;