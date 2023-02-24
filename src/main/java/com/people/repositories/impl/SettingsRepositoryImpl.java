package com.people.repositories.impl;

import com.people.model.Settings;
import com.people.model.mapper.SettingsMapper;
import com.people.repositories.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcOperations;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class SettingsRepositoryImpl implements SettingsRepository {

    private final NamedParameterJdbcOperations namedParameterJdbcOperations;

    @Value("#{sqlReader.getStatement('sqls/settings.sql')}")
    private String getSettings;

    @Override
    public void saveForUserById(Settings settings) {

    }

    @Override
    public Settings getSettingsByUserId(String userId) {
        String sql = getSettings;
        Map<String, Object> params = new HashMap<>();
        params.put("id", new BigDecimal(userId));
        return namedParameterJdbcOperations.query(sql, params, new SettingsMapper()).get(0);
    }
}
