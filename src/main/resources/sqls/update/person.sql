update
	people
set
	first_name = :first_name,
	p_p_id = :parent_id,
	second_name = :second_name,
	patronymic = :patronymic,
	age = :age,
	email = :email,
	address = :address
where
	p_id = :id;