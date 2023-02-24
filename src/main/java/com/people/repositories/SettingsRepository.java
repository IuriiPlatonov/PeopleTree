package com.people.repositories;

import com.people.model.Settings;

public interface SettingsRepository {

    void saveForUserById(Settings settings);

    Settings getSettingsByUserId(String userId);
}
