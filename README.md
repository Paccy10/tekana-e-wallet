# Tekana-eWallet

## Mission

Rebuild from scratch a back-end solution for legacy platform that serves 1 million customers around the world. We would like to re-design the whole technology stack with a top notch back-end stack.

## Strategy

### Day 1 - Project Kick-off and Planning:

- **Stakeholder Meeting**: Arrange a meeting with the entire team (back-end, front-end, UI/UX designers, product owner, Scrum Master, and business team) to discuss the project scope and goals.

- **Requirement Gathering**: Collaborate with the business team to understand the current application's functionality and gather detailed requirements for the new back-end solution.

- **Technology Stack Selection**: Evaluate the suatability of different backend technologies(NestJs, SpringBoot, Django, etc.) for the project and make a decision based on team expertise and project requirements.

- **Team Organization**: Create a clear team structure, allocate roles and responsibilities, and establish communication channels.

### Week 1-2 - Architecture and Design:

- **System Architecture**: Define the overall system architecture, considering scalability, high availability, and security. Identify microservices and APIs for interaction between front-end and back-end.

- **Database Design**: Design the database schema, considering data types, indexing, normalization, and partitioning for high performance. Choose an appropriate database management system.

- **API Design**: Define the API endpoints and document them according to best practices, including clear naming conventions, HTTP methods, and security considerations.

### Week 3-10 - Development:

- **Modular Development**: Implement the back-end solution in a modular fashion, adhering to coding standards. Encourage clean code practices and version control.

- **Simplicity and Readability**: Write clean and readable code, use meaningful variable names, provide clear function and class definitions, and include comments and documentation for maintainability.

- **Unit Testing**: Develop comprehensive unit tests to ensure the code is easily testable, and maintain a good code coverage percentage.

### Week 11-12 - Testing and Optimization:

- **Testing Phase**: Execute thorough testing, including unit testing, integration testing, and user acceptance testing, and address any issues that arise.

- **Performance Optimization**: Optimize the code and database for high performance, making use of indexing and other database optimization techniques.

### Week 13-14 - Documentation and Deployment:

- **API Documentation**: Create clear, consistent, and comprehensive API documentation, including usage guidelines, versioning, and error handling.

- **Deployment Plan**: Prepare a deployment plan, including a pilot system deployment to a controlled environment for testing.

### Week 15 - Pilot System Testing:

- **Pilot Deployment**: Deploy the pilot system to a limited user group for real-world testing and gather feedback.

- **Bug Fixes**: Address any issues or bugs identified during the pilot phase and make necessary improvements.

### Week 16 - Final Deployment:

- **Full Deployment**: Deploy the new back-end solution to all 1 million customers worldwide.

- **Monitoring and Support**: Implement monitoring tools to track system performance and provide ongoing support for the live system.

### Throughout the Project:

- **Collaboration**: Maintain constant communication with the front-end, UI/UX designers, and product owner to ensure alignment with the project's goals and user experience expectations.

  - Sprint planning: Conduct sprint planning meetings to decide on what's needed to be accomplished during the sprint

  - Daily Stand-Up Meetings: Do daily stand-up meetings to help the development team synchronize and plan their work for the day.
  - Sprint Demos: Do Sprint demos at the end of each sprint to showcase the completed work to stakeholders and gather feedback.

- **Creativity and Innovation**: Encourage the team to think creatively and innovate when solving problems, and continually seek opportunities to improve the solution.

## Running the application

### Requirements

```
- docker
- docker compose V3 (If you use V2, use docker-compose when running docker compose commands)
```

### Installation and Setup

- Clone the repository

```
git clone https://github.com/Paccy10/tekana-e-wallet.git
```

- Environment variables

```
Create a .env file and copy variables from .env.sample to .env and fill them accordingly (Check the submitted document for values)
```

- Build and run the app

```
docker compose up --build -d --remove-orphans
```

- Run the app

```
docker compose up -d
```

- Run migrations (This step is very important to start using the app 🚨)

```
docker compose exec api npm run migration:run
```

- Stop the app

```
docker compose down
```

- Check logs

```
docker compose logs
```
