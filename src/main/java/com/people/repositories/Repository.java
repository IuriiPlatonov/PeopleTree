package com.people.repositories;

import java.util.List;

public interface Repository<T> {
	void create(T object);
	void update(T object);
	void delete(T object);
	List<T> getAll();
	T getById(String id);
}
