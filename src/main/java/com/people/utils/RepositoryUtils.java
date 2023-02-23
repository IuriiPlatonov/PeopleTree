package com.people.utils;

import org.apache.commons.lang3.StringUtils;

import java.math.BigDecimal;

public class RepositoryUtils {

    public static BigDecimal getBigDecimalOrNull(String field) {
        return StringUtils.isBlank(field) ? null : new BigDecimal(field);
    }

    public static BigDecimal getBigDecimalOrZero(String field) {
        return StringUtils.isBlank(field) ? BigDecimal.ZERO : new BigDecimal(field);
    }
}
