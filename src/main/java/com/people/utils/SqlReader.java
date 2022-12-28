package com.people.utils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class SqlReader
{
    public static String getStatement(final String file)
    {
        try
        {
            return IOUtils.toString(
                new ClassPathResource(file).getInputStream(),
                StandardCharsets.UTF_8.name());
        }
        catch (IOException exception)
        {
            throw new IllegalStateException(
                "Error reading for file [" + file + "]", exception);
        }
    }
}
