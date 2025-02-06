package com.example.sep490.configs;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.sep490.entities.Product;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // Cấu hình Matching Strategy
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

//        modelMapper.addMappings(new PropertyMap<Product, ProductDTO>() {
//            @Override
//            protected void configure() {
//                map(source.getId(), destination.getId()); 
//                map(source.getName(), destination.getName()); 
//                map(source.getPrice(), destination.getPrice()); 
//            }
//        });

        return modelMapper;
    }
}
