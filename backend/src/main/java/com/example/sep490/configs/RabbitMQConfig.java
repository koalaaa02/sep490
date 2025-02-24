package com.example.sep490.configs;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String MESSAGE_QUEUE = "messageQueue";
    public static final String ORDER_QUEUE = "orderQueue";
    public static final String MAIL_QUEUE = "mailQueue";

    public static final String MESSAGE_ROUTING_KEY = "message.routing.key";
    public static final String ORDER_ROUTING_KEY = "order.routing.key";
    public static final String MAIL_ROUTING_KEY = "mail.routing.key";

    public static final String EXCHANGE = "notificationExchange";

    @Bean
    public Queue messageQueue() {
        return new Queue(MESSAGE_QUEUE, true);
    }

    @Bean
    public Queue orderQueue() {
        return new Queue(ORDER_QUEUE, true);
    }

    @Bean
    public Queue mailQueue() {return new Queue(MAIL_QUEUE, true);}

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Binding bindingMessageQueue(Queue messageQueue, TopicExchange exchange) {
        return BindingBuilder.bind(messageQueue).to(exchange).with(MESSAGE_ROUTING_KEY);
    }

    @Bean
    public Binding bindingOrderQueue(Queue orderQueue, TopicExchange exchange) {
        return BindingBuilder.bind(orderQueue).to(exchange).with(ORDER_ROUTING_KEY);
    }

    @Bean
    public Binding bindingMailQueue(Queue mailQueue, TopicExchange exchange) {
        return BindingBuilder.bind(mailQueue).to(exchange).with(MAIL_ROUTING_KEY);
    }


    //======== serialize khi truyền message ========
    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         Jackson2JsonMessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        return template;
    }
}

