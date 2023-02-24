package com.people.services.impl;

import com.people.dto.SettingsDto;
import com.people.dto.mapper.SettingsDtoMapper;
import com.people.repositories.SettingsRepository;
import com.people.services.SettingsService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingsServiceImpl implements SettingsService {

    private final SettingsDtoMapper settingsDtoMapper;
    private final SettingsRepository settingsRepository;
    @Override
    public SettingsDto getSettings(String userId) {
        return settingsDtoMapper.toDto(settingsRepository.getSettingsByUserId(userId));
    }
}
