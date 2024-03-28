NestJS E-commerce Application

This project is an Ambassador application built using NestJS, Apache Kafka, Kubernetes Engine on Google Cloud, Redis, and Stripe gateway. It consists of separate microservices for admin functionalities, ambassador functionalities, checkout, and authentication.

![final drawio](https://github.com/MuhammedAfsalkp/Nestjs-Ambassdor-Microservices/assets/82488425/1db03737-2aa7-4b56-9952-14dd419f9cf1)

Architecture Overview
The application architecture consists of multiple microservices communicating via Apache Kafka:

Admin Microservice: Handles product management and admin dashboard functionalities.
Ambassador Microservice: Manages ambassador functionalities, including product listing, link creation, and revenue tracking.
Checkout Microservice: Responsible for payment processing and order completion.
User Microservice: Handles user authentication using JWT and cookies.
The services are deployed on Kubernetes Engine on Google Cloud, with Apache Kafka configured on Confluent Cloud. Redis is used for caching rankings, and Stripe gateway is integrated for payment processing.

Features
Admin Dashboard: Administrators can create, update, and delete products.
Ambassador Dashboard: Ambassadors can list products, create shareable links, and track revenue.
Checkout Page: User can purchase products
Revenue Sharing: Ambassadors receive 10% of the revenue generated from their links, while the admin receives 90%.
Rankings: Rankings of ambassadors are generated based on the revenue they generate.
Statistics: Detailed statistics are provided for orders generated through each ambassador's links.
Email Notifications: Email notifications are sent upon order completion using an email service.

Technologies Used
NestJS
SQL(TypeORM)
Apache Kafka(MIcroservices architecture)
Kubernetes Engine on Google Cloud
Redis
Stripe gateway
Docker
Confluent Cloud
Reactjs/NextJs
