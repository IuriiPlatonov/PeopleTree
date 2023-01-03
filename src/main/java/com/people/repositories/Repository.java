package com.people.repositories;

public interface Repository<T> {
    void create(T object);

    void update(T object);

    void delete(T object);

    T getById(String id);
}
