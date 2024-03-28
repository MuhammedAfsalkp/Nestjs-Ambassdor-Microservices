NestJS E-commerce Application

This project is an E-commerce application built using NestJS, Apache Kafka, Kubernetes Engine on Google Cloud, Redis, and Stripe gateway. It consists of separate microservices for admin functionalities, ambassador functionalities, checkout, and authentication.

![final drawio](https://github.com/MuhammedAfsalkp/Nestjs-Ambassdor-Microservices/assets/82488425/1db03737-2aa7-4b56-9952-14dd419f9cf1)

Architecture Overview
The application architecture consists of multiple microservices communicating via Apache Kafka:

Admin Microservice: Handles product management and admin dashboard functionalities.
Ambassador Microservice: Manages ambassador functionalities, including product listing, link creation, and revenue tracking.
Checkout Microservice: Responsible for payment processing and order completion.
Authentication Microservice: Handles user authentication using JWT and cookies.
The services are deployed on Kubernetes Engine on Google Cloud, with Apache Kafka configured on Confluent Cloud. Redis is used for caching rankings, and Stripe gateway is integrated for payment processing.
