__NestJS E-commerce Ambassador Application__

This project utilizes NestJS with Apache Kafka to build an E-commerce  Ambassadorapplication. Embracing microservices architecture, Apache Kafka facilitates seamless communication between services, ensuring scalability, flexibility, resilience, and ease of feature addition and enhancement.

![final drawio](https://github.com/MuhammedAfsalkp/Nestjs-Ambassdor-Microservices/assets/82488425/1db03737-2aa7-4b56-9952-14dd419f9cf1) 

## Architecture Overview 
The application architecture consists of multiple microservices communicating via Apache Kafka:

-Admin Microservice: Handles product management and admin dashboard functionalities.
-Ambassador Microservice: Manages ambassador functionalities, including product listing, link creation, and revenue tracking.
-Checkout Microservice: Responsible for payment processing and order completion.
-User Microservice: Handles user authentication using JWT and cookies.
-Email MicroSErvice: Responsible for sending email upon order completion,to  notify users.
-The services are deployed on Kubernetes Engine on Google Cloud, with Apache Kafka configured on Confluent Cloud. Redis is used for caching rankings, and Stripe gateway is integrated for payment processing.  

**Service Details**

| Service Name            | Port Allocated | INgress path                          | Kafka Topic             |
|-------------------------|----------------|---------------------------------------|-------------------------|
| Checkout Microservice   | 8004           | http://34.149.244.248/api/checkout/   | checkout_topic          |
| User Microservice       | 8001           | No Frontend access                    |                         |
| Admin Microservice      | 8002           | http://34.149.244.248/api/admin/       | admin_topic             |
| Ambassador Microservice |  8003          | http://34.149.244.248/api/ambassador/  | ambassador_topic        |
| Email Microservice      |                | Consumer                              | email-topic             |

## Technologies Used 
- [x]NestJS  
- [x]SQL(TypeORM)  
- [x]Apache Kafka(For microservices communication)  
- [x]Kubernetes Engine on Google Cloud  
- [x]Redis  
- [x]Stripe paayment gateway  
- [x]Docker  
- [x]Confluent Cloud  
- [x]Reactjs/NextJs


## Features
-Admin Dashboard: Administrators can create, update, and delete products. 
-Ambassador Dashboard: Ambassadors can list products, create shareable links, and track revenue.  
-Checkout Page: User can purchase products.  
-Revenue Sharing: Ambassadors receive 10% of the revenue generated from their links, while the admin receives 90%.  
-Rankings: Rankings of ambassadors are generated based on the revenue they generate.  
-Statistics: Detailed statistics are provided for orders generated through each ambassador's links.  
-Email Notifications: Email notifications are sent upon order completion using an email service.  

