package com.people.repositories.impl;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.stereotype.Repository;

import com.people.model.Person;
import com.people.model.mapper.PersonMapper;
import com.people.repositories.PeopleRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PeopleRepositoryImpl implements PeopleRepository {

	private final NamedParameterJdbcOperations namedParameterJdbcOperations;

	@Value("#{sqlReader.getStatement('sqls/people.sql')}")
	private String people;
	@Value("#{sqlReader.getStatement('sqls/update/personPosition.sql')}")
	private String updatePersonPosition;
	@Value("#{sqlReader.getStatement('sqls/delete/person.sql')}")
	private String deletePerson;
	@Value("#{sqlReader.getStatement('sqls/create/person.sql')}")
	private String updatePerson;

	@Override
	public void create(Person object) {

	}

	@Override
	public void update(Person object) {
		String sql = updatePerson;
		Map<String, Object> params = new HashMap<>();
		params.put("id", new BigDecimal(object.getId()));
		params.put("first_name", object.getFirstName());
		params.put("second_name", object.getSecondName());
		params.put("patronymic", object.getPatronymic());
		params.put("email", object.getEmail());
		params.put("age", StringUtils.isBlank(object.getAge()) ? null : new BigDecimal(object.getAge()));
		params.put("address", object.getAddress());

		namedParameterJdbcOperations.update(sql, params);
	}

	@Override
	public void delete(Person object) {
		String sql = deletePerson;
		Map<String, Object> params = new HashMap<>();
		params.put("id", new BigDecimal(object.getId()));

		namedParameterJdbcOperations.update(sql, params);
	}

	@Override
	public List<Person> getAll() {
		String sql = people;
		Map<String, Object> params = new HashMap<>();

		return namedParameterJdbcOperations.query(sql, params, new PersonMapper());
	}

	@Override
	public Person getById(String id) {
		return null;
	}

	@Override
	public void updatePosition(String id, String posX, String posY) {
		String sql = updatePersonPosition;
		Map<String, Object> params = new HashMap<>();
		params.put("id", new BigDecimal(id));
		params.put("pos_x", new BigDecimal(posX));
		params.put("pos_y", new BigDecimal(posY));

		namedParameterJdbcOperations.update(sql, params);
	}

}
