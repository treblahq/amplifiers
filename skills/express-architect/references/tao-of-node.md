# Tao of Node - Design, Architecture & Best Practices

Author: Alex Kondov

Published: March 14, 2022

Source: https://alexkondov.com/tao-of-node/

One of the main benefits of JavaScript is that it runs both in the browser and the server. As an engineer you need to master a single language and your skills will have a variety of applications. This is what drew me to Node in 2015 - I didn’t have to switch between languages and tech stacks.

Node allows you to reuse libraries, logic, and types across front-end and back-end applications. It gave rise to the full-stack developer archetype - an engineer skillful enough to work on any part of the application they are needed.

It grew from a questionable technology to one used for critical infrastructure in many large enterprises. It performs incredibly well for high-volume IO operations with a much lower code complexity than languages that rely on multi-threading.

Node’s ecosystem is focused on freedom and flexibility, breaking away from the heavy frameworks established at the time of its inception. It doesn’t impose strict coding standards or application structures. But there’s a price to pay for flexibility.

A newcomer to JavaScript, even if they are an engineer experienced in a different language, will have a hard time finding rules and principles for writing Node applications. Developers with an OOP background quickly adopted practices from their previous languages.

To this day, it’s hard to find two Node applications that are structured similarly. In this post, I will summarize the set of principles that I’ve established about building Node applications.

**Take everything here as an opinion**, not an absolute. There’s more than one way to build software.

## Table of Contents

- [Structure & Coding Practices](#structure--coding-practices)
  - [Structure the application in modules](#structure-the-application-in-modules)
  - [Start with a modular monolith](#start-with-a-modular-monolith)
  - [Create layers](#create-layers)
  - [Use services to communicate between modules](#use-services-to-communicate-between-modules)
  - [Create domain entities](#create-domain-entities)
  - [Separate utility functions and domain logic](#separate-utility-functions-and-domain-logic)
  - [Use hypermedia for REST APIs](#use-hypermedia-for-rest-apis)
  - [Validate request structure](#validate-request-structure)
  - [Validate in middleware](#validate-in-middleware)
  - [Handling business logic in middleware](#handling-business-logic-in-middleware)
  - [Favor functions and objects to classes](#favor-functions-and-objects-to-classes)
  - [Use the error object or extend it](#use-the-error-object-or-extend-it)
  - [Listen to process signals](#listen-to-process-signals)
  - [Centralize error handling](#centralize-error-handling)
  - [Send 404 response in middleware](#send-404-response-in-middleware)
  - [Don't send error responses in the handler](#dont-send-error-responses-in-the-handler)
  - [Shut down the app when you can't recover](#shut-down-the-app-when-you-cant-recover)
  - [Enforce consistency](#enforce-consistency)
  - [Co-locate functionality](#co-locate-functionality)
  - [Keep routes in modules](#keep-routes-in-modules)
  - [Prefix API routes](#prefix-api-routes)
  - [Attach the user for authenticated requests](#attach-the-user-for-authenticated-requests)
  - [Avoid callback-based APIs](#avoid-callback-based-apis)
- [Tooling](#tooling)
  - [Favor minimalistic tooling](#favor-minimalistic-tooling)
  - [Favor Express as a framework](#favor-express-as-a-framework)
  - [Favor query builders to ORMs](#favor-query-builders-to-orms)
  - [Favor native methods to libraries](#favor-native-methods-to-libraries)
  - [Extracting libraries](#extracting-libraries)
  - [Use a structured logger](#use-a-structured-logger)
  - [Document the application](#document-the-application)
  - [Pin dependency versions](#pin-dependency-versions)
  - [Use TypeScript](#use-typescript)
  - [Use Snyk](#use-snyk)
  - [Containerize the application](#containerize-the-application)
  - [Do not worry about database changes](#do-not-worry-about-database-changes)
  - [Encapsulate configuration](#encapsulate-configuration)
  - [Use hierarchical config](#use-hierarchical-config)
- [Testing](#testing)
  - [Favor integration testing](#favor-integration-testing)
  - [Consider dependency injection over mocking](#consider-dependency-injection-over-mocking)
  - [Unit test the business logic](#unit-test-the-business-logic)
  - [Invest in high test coverage](#invest-in-high-test-coverage)
  - [Follow the Arrange-Act-Assert pattern](#follow-the-arrange-act-assert-pattern)
- [Performance](#performance)
  - [Don't block the event loop](#dont-block-the-event-loop)
  - [Don't optimize for algorithmic complexity](#dont-optimize-for-algorithmic-complexity)
  - [Don't optimize prematurely](#dont-optimize-prematurely)

## Structure & Coding Practices

Structuring an application is a combination of strategic and tactical decisions. A developer must think both about the folder arrangement, the layers, and the communication between them, but about the low-level details. Neglecting one of them leads to a flawed design.

### Structure the application in modules

The most popular structural design pattern in back-end development is MVC. It’s applicable in most situations and you won’t go wrong if you pick it. It revolves around structuring your application around the technical responsibilities in it. You have controllers that handle the HTTP requests and responses, models that fetch data from a database, and views that visualize the response.

But the benefits of this approach are not strong enough. Nowadays, most Node applications are REST services that communicate via JSON so the view layer is not needed. Using models and ORMs is not always desired since a microservice that owns a fraction of the data doesn’t need complex tooling to access it. And the controllers often become a central point of complexity, inviting developers to dump all kinds of logic into them.

Separation of concerns is a different thing than separation of technical responsibilities.

A plus of the MVC structure is that each application that uses it will be structured in the same way. But I see this as a flaw. An application’s structure should tell you what it does and provide information about its domain. Opening a folder full of controllers doesn’t provide any context about the logical separation in your service. A long list of models tells nothing about the relationships between them.

A better way to structure a node application is in modules representing a part of the domain. Each is a separate folder containing all handlers, models, tests, and business logic for a part of the business. This structure gives an idea of what the service is doing at a glance and you have confidence that everything related to the users, for example, is in the user module. No need to dig through the codebase to make sure that you haven’t missed anything.

```text
// 👎 Don't structure by technical responsibilities
├── src
|   ├── controllers
|   |   ├── user.js
|   |   ├── catalog.js
|   |   ├── order.js
|   ├── models
|   |   ├── user.js
|   |   ├── product.js
|   |   ├── order.js
|   ├── utils
|   |   ├── order.js
|   ├── tests
|   |   ├── user.test.js
|   |   ├── product.test.js

// 👍 Structure by domain modules
├── src
|   ├── user
|   |   ├── user-handlers.js
|   |   ├── user-service.js
|   |   ├── user-queries.js
|   |   ├── user-handlers.test.js
|   |   ├── index.js
|   ├── order
|   |   ├── order-handlers.js
|   |   ├── order-service.js
|   |   ├── order-queries.js
|   |   ├── order-handlers.test.js
|   |   ├── calculate-shipping.js
|   |   ├── calculate-shipping.test.js
|   |   ├── index.js
|   ├── catalog
|   |   ├── catalog-handlers.js
|   |   ├── product-queries.js
|   |   ├── catalog-handlers.test.js
|   |   ├── index.js
```

There’s no particular pattern to follow when it comes to module structure. They may have different contents depending on their part of the domain. They may differ in the number of handlers, models, or size of the business logic they own.

The main idea is that an app that operates in the financial industry and one that operates in the medical one should be structured differently. The differences in how their domains operate should be visible in the codebase. We need to structure depending on the real-world problems that our software solves. Every business domain faces different challenges, thus we shouldn’t design applications the same.

### Start with a modular monolith

Perhaps the most important question you need to answer before you start working on a new application is whether it will be a monolith or based on microservices. In recent years most developers and architects go for the latter option because it provides better scalability, independence and solves the organizational challenges of working on a large-scale project.

Microservices are a widely adopted pattern that splits an application into multiple small services that communicate with one another. The most trivial example is a system that has separate components for users, products, and orders. E-commerce is a frequently used example because the boundaries between the entities are well-defined. But this is not always the case.

Depending on the domain you’re working in, the boundaries may be blurry, making it hard to distinguish what operation goes in which service. Separating the services gives a lot of benefits but opens the door to the problems of distributed systems. So I always advise people to start with a modular monolith first and allow the application to evolve before they start extracting things.

I hold the unpopular opinion that monoliths are underrated. They allow you to move faster and work in semi-isolation by focusing on a specific module. It’s easier to move things around because everything is in the same repo and if you maintain good modularity, extracting a service from a monolith should not be that hard.

This is a good mental model to keep when you’re developing your application. Think of each module as a potentially separate service and rely on contracts to communicate between them.

### Create layers

The biggest design flaw of most Node services is that they do too much in their handler functions. This is the problem that controller classes experience in applications using the MVC structure. By handling the transport, data access, and business logic in a single function we create a tightly coupled blend of functionality.

It’s not uncommon to see validation, business logic and database calls that use values directly from the request object. **Note: the examples are simplistic on purpose.**

```js
// 👎 Avoid creating handlers with too many responsibilities
// unless the scope of the application is small
const handler = async (req, res) => {
  const { name, email } = req.body

  if (!isValidName(name)) {
    return res.status(httpStatus.BAD_REQUEST).send()
  }

  if (!isValidEmail(email)) {
    return res.status(httpStatus.BAD_REQUEST).send()
  }

  await queryBuilder('user').insert({ name, email })]

  if (!isPromotionalPeriod()) {
    const promotionalCode = await queryBuilder
      .select('name', 'valid_until', 'percentage', 'target')
      .from('promotional_codes')
      .where({ target: 'new_joiners' })

    transport.sendMail({
      // ...
    })
  }

  return res.status(httpStatus.CREATED).send(user)
}
```

This is an acceptable approach in small applications that do not require a lot of maintenance. But larger ones that are going to be extended will be hindered by such a decision.

The handlers become long, hard to read, and hard to test. It’s a common understanding that a function should focus on one thing, but in this case, the handler function has too many responsibilities. It shouldn’t handle validation, business logic, and data fetching.

Instead, the handler function should focus on the transport (HTTP) layer. Everything related to data fetching and external communication should be extracted in its own function or module.

```js
// 👍 Handlers should only handle the HTTP logic
const handler = async (req, res) => {
  const { name, email } = req.body

  if (!isValidName(name)) {
    return res.status(httpStatus.BAD_REQUEST).send()
  }

  if (!isValidEmail(email)) {
    return res.status(httpStatus.BAD_REQUEST).send()
  }

  try {
    const user = userService.register(name, email)
    return res.status(httpStatus.CREATED).send(user)
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send()
  }
}
```

Usually, the modules that deal with such things are labeled as “services”. I’m not sure about the historical reasons behind that but let’s stick to the terminology so everyone understands what we mean.

By grouping this logic in a “service” we establish a layer - the handler deals with the transport and our service manages the domain and data access logic without knowing whether it’s responding to an HTTP request or a message from an event-driven system.

The reason we do this is to put a wedge between the different responsibilities in our application and create boundaries. For applications with a small amount of complexity, just this step would be a great improvement.

But you will notice that the service keeps logic related to users, promotional code and emails. We have put a boundary between the transport logic, and everything else but in terms of responsibilities, our service is still doing too much.

```js
// user-service.js
export async function register(name, email) {
  const user = await queryBuilder('user').insert({ name, email })]

  if (!isPromotionalPeriod()) {
    const promotionalCode = await promotionService.getNewJoinerCode()
    await emailService.sendNewJoinerPromotionEmail(promotionalCode)
  }

  return user
}
```

By extracting the logic that is not directly related to the user, we make this service delegate instead of doing everything on its own. But one can argue that even now, the service’s responsibilities are stretching too far.

A widely used pattern is to further extract the data access logic in a “repository”.

```js
// user-service.js
export async function register(name, email) {
  const user = await userRepository.insert(name, email)

  if (!isPromotionalPeriod()) {
    const promotionalCode = await promotionService.getNewJoinerCode()
    await emailService.sendNewJoinerPromotionEmail(promotionalCode)
  }

  return user
}
```

By encapsulating the data access we leave the service to be responsible only for the business logic, further improving the testability and readability. But most importantly, we add another wedge between the business and data functionality.

Now our application’s logic is split between the transport, domain, and data access layers. Changing each one would require little to no changes in the others. If our application needs to start ingesting Kafka messages we can add another transport layer and reuse the domain and data ones.

Having to move from REST to gRPC or messaging is a very rare occurrence. Changing a database is even rarer. But by accepting these possibilities we greatly improve the extensibility, readability, and testability of our application.

Yet, this structure is not that popular in Node, and for good reason. **Not all applications could benefit from it**. The advice I would give is to add layers as complexity grows. Start the first implementation by using only the handlers. Then follow the steps above to add structure.

### Use services to communicate between modules

In an MVC-structured application, the boundaries are between the technical responsibilities in the app. There are no established boundaries between the different logical sections. As mentioned previously, I’m a big advocate for modular structuring where each module describes a part of the domain.

For example, you may have a user module that keeps the handlers for the authentication routes and account routes. You have a separate module about orders that handles everything related to them. But imagine that your application has a use case in which a user can update their address while making an order.

This logic encompasses two of our modules and we’re faced with the conundrum of where exactly to implement it. We can write a database query to update the user’s details in the deliveries module but this means we’ll have logic related to users outside of the user module and that breaks the boundaries again.

To avoid this, it’s best to implement the user-related logic in a service in the user module. Then call that function from the deliveries module. This way we retain the boundaries and locate the logic where it needs to be. The deliveries module doesn’t know the details of updating the user, it relies on an abstraction.

```js
// 👎 Don't break the boundaries of the domain modules
const placeOrderHandler = (req, res) => {
  const { products, updateShippingAddress } = req.body

  if (updateShippingAddress) {
    // Update the user's default shipping address
    const { user } = res.locals
    const { shippingAddress } = req.body
    knex('users').where('id' '=', user.id).update({ shippingAddress })
  }
}

// 👍 Communicate using services
const placeOrderHandler = (req, res) => {
  const { products, updateShippingAddress } = req.body

  if (updateShippingAddress) {
    // Update the user's default shipping address
    const { user } = res.locals
    const { shippingAddress } = req.body
    userService.updateShippingAddress(user.id, shippingAddress)
  }
}
```

This way if we need to extract that service outside of the main application, the deliveries module can still call the same function, there will be no changes required to it. In the same way if we start using a managed service for the users, we can still do the same, nothing will change for the deliveries module

### Create domain entities

One of the main responsibilities of a Node service is to retrieve data and send it somewhere. This can be as a result of an HTTP request, an event or it can be a scheduled job. A common practice is for the data to be returned in the exact shape it is stored in.

```js
// product-repository.js
// 👎 Avoid returning data directly from storage
// If the storage imposes constraints on naming and formatting.
export async function getProduct(id) {
  return dbClient.getItem(id)
}
```

This works when there are no differences between the shape of the data in the store and the shape the service operates on. But too often it is a way to leak database details in your code - a practice that should be avoided.

Most services that do transformations on the data they send implement it in the transport layer, mapping it just before it is sent. I see this as a flaw because the whole application becomes aware of the details of the database.

Instead, the service should define its own domain entity and transform the data from the store to it as soon as possible.

```js
// product-repository.js
// 👍 Map the retrieved item to a domain object
// Rename storage-specific fields and improve its structure.
export async function getProduct(id) {
  const product = dbClient.getItem(id)
  return mapToProductEntity(product)
}
```

This seems like an overly complex mechanism borrowed from the enterprise world. If the shape of the data you return from the database is equivalent to the shape of the data you need to work with, then you can easily skip this step, but this is not always the case.

For example, when you’re using DynamoDB, it’s common to overload indexing columns. They often have generic names like `GSIPK` and `GSISK` that hold different types of data depending on the item type. It’s up to the application to resolve them to meaningful values and the sooner you do that the better.

Working with storage-specific fields in the code leaks the details of your data layer everywhere and we want to avoid that. Some engineers argue whether this should be done as a part of the domain layer. But the domain layer is the heart, the core of your application - it shouldn’t be coupled to specific storage.

In other words, make everything in your power to make your domain layer as simple as possible. This is a good first step. This can be further enforced by using TypeScript and relying on functions to communicate only using the domain entities.

### Separate utility functions and domain logic

Most projects I’ve seen usually have a catch-all folder called utilities that is home to all functionality the developers are not sure where to put. It holds everything from reusable functions, to business logic and constants.

The utilities folder should be a toolbox that you can ideally lift and put in another project with minimal effort. If the logic in them is business-specific it means they should be a part of the domain layer, they’re not just a utility.

The trouble many developers have is distinguishing the domain logic from the rest of their application. There isn’t a single best way to do that because each application’s domain is different. We focus on the transport layer and the data-access one because they are the same everywhere.

I’d advise you not to shoehorn everything into the utility folder but create separate files and group the business logic in them.

```text
// 👎 Don't put everything into a utility folder
├── src
|   ├── user
|   |   ├── ...
|   ├── order
|   |   ├── ...
|   ├── catalog
|   |   ├── ...
|   ├── utils
|   |   ├── calculate-shipping.js
|   |   ├── watchlist-query.js
|   |   ├── products-query.js
|   |   ├── capitalize.js
|   |   ├── validate-update-request.js

// 👍 Separate utilities and domain logic
├── src
|   ├── user
|   |   ├── ...
|   |   ├── validation
|   |   |   ├── validate-update-request.js
|   ├── order
|   |   ├── ...
|   |   ├── calculate-shipping.js
|   ├── catalog
|   |   ├── ...
|   |   ├── queries
|   |   |   ├── products-query.js
|   |   |   ├── watchlist-query.js
|   ├── utils
|   |   ├── capitalize.js
```

### Use hypermedia for REST APIs

REST APIs are the standard way of HTTP communication nowadays. The standard is easy to implement regardless of the language or framework you are using and it greatly improves the communication process between services. Structuring URLs around resources makes them intuitive and recognizable. The HTTP verbs clearly signal intent so you don’t have to put it in the URL.

But most REST APIs are limited only to resource-based URLs and HTTP verbs. According to the Richardson Maturity Model (developed by Leonard Richardson), these are only the first two levels of a three-level model to build truly RESTful APIs.

The final level of maturity introduces something called HATEOS (Hypertext As The Engine Of Application State). This solves the problem of discovery and further decouples the clients from the services. As a client, unless you have the documentation at hand you will need to guess the correct URL to send a request to or the HTTP verb it expects. A typical culprit is APIs differing in how they use PATCH and PUT.

Another problem is the tight coupling this creates between clients and servers. The server has no way of communicating that a change is made to the URL structure and this requires versioning and maintenance on multiple endpoints if an update needs to be made.

With HATEOS, a REST API can send to the client the URLs of related resources or operations. For example, when you make a request to fetch a single resource, like an article, the REST API will also send the links to update, delete and fetch all articles - all related operations.

This adds more complexity to the client since the URLs are dynamic but greatly reduces the coupling and manual configuration. The idea behind hypertext is that it tells the client what it can do and how it can do it.

### Validate request structure

Each service that handles external data needs to validate it. Most services I’ve worked with, regardless of the language, have a fair amount of validation logic - checking for fields and validating data types. It’s important to know that the data you receive has the correct structure so you can work with it confidently.

However, the validation logic can get verbose and repetitive. If you’re writing it yourself you will need to handle the error messages and maintain them. To avoid this and have a cleaner API it’s better to use a library to validate the request payload against a JSON schema.

The examples use Joi because of its popularity, but you should also have a look at `ajv` and `express-validator`.

```js
// 👎 Don't validate requests explicitly
const createUserHandler = (req, res) => {
  const { name, email, phone } = req.body
  if (name && isValidName(name) && email && isValidEmail(email)) {
    userService.create({
      userName,
      email,
      phone,
      status,
    })
  }

  // Handle error...
}

// 👍 Use a library to validate and generate more descriptive messages
const schema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^\d{3}-\d{3}-\d{4}$/)
    .required(),
})

const createUserHandler = (req, res) => {
  const { error, value } = schema.validate(req.body)
  // Handle error...
}
```

You need to write down the shape of the object you expect together with its types and the library will validate against it, providing clean and descriptive error messages in return. I’d suggest catching the error thrown by the validation library and enriching it with a status code of 422 (Unprocessable Entity) before throwing it again to be handled by the central error handler.

### Validate in middleware

A key consideration when designing your service’s layers is where to put the validation logic. Should it be a part of the transport layer in the handler or a part of the business logic? I’d recommend validating the data before it has the chance to reach the handler.

It’s best to have a chain of middleware that does a series of validation checks so once the request reaches the handler, you can safely operate with the data.

```js
// Create a reusable validation middleware
const validateBody = (schema) => (req, res, next) => {
  const { value, error } = Joi.compile(schema).validate(req.body)

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ')

    return next(new AppError(httpStatus.BAD_REQUEST, errorMessage))
  }

  Object.assign(req, value)
  return next()
}

// Use it in the route definitions
app.put('/user', validate(userSchema), handlers.updateUser)
```

It’s best to have granular middleware that gets chained rather than a few large ones that are focused on a specific path. This way you can implement an authentication check once and use it in multiple routes by chaining it with the route-specific validation.

The express-validator library mentioned in the previous point fits well into a middleware-based validation approach.

### Handling business logic in middleware

When we start to define layers and boundaries we start facing dilemmas that we didn’t have before. One of them is about the responsibilities of middleware and what logic should be written in them.

Middleware is still a part of the transport layer since they get access to the raw request, so they should follow the same rules that apply to handlers. It should decide whether to stop further execution or continue but the business logic itself is best implemented in a different place.

```js
// 👎 Don't implement business logic in the middleware
const hasAdminPermissions = (req, res, next) => {
  const { user } = res.locals

  const role = knex.select('name').from('roles').where({ 'user_id', user.id })

  if (role !== roles.ADMIN) {
    throw new AppError(httpStatus.UNAUTHORIZED)
  }

  next()
}

// 👍 Delegate to a service call
const hasAdminPermissions = (req, res, next) => {
  const { user } = res.locals

  if (!userService.hasPermission(user.id)) {
    throw new AppError(httpStatus.UNAUTHORIZED)
  }

  next()
}
```

By delegating the call to another module/function, the middleware remains oblivious of the logic behind it. I also try to use more generic names for such functions. Instead of `hasAdminAccess` I would name it `hasPermissions` because the access logic may change if the roles change. It’s a small consideration to reduce the amount of potential future refactoring.

### Favor handler functions to controller classes

In batteries included MVC frameworks, HTTP handlers are grouped in controller classes. The reason for that is they usually extend a base class that provides you with all the logic and functionality you need to work with a request and send a response.

In Express and other minimalistic frameworks, you are not required to extend a class to have access to this functionality. Instead, your handler functions are passed the request and response objects with all the methods you need to be attached to them. I just can’t find a reason to use a class here unless your codebase is heavily based on OOP.

```js
// 👎 Don't use a class just for the sake of grouping your logic
class UserController {
  updateDetails(req, res) {}
  register(req, res) {}
  authenticate(req, res) {}
}

// 👍 Use simple handler functions instead
export function updateDetails(req, res) {}
export function register(req, res) {}
export function authenticate(req, res) {}
```

Functions are easier to move around in separate files if they become lengthy. Even if you need to keep state and inject something, I find it simpler to use a factory function and pass it the objects that I need (this is a very useful practice to avoid mocking).

```js
export function createHandler(logger, userService) {
  return {
    updateDetails: (req, res) => {
      // User the logger and service in here
    },
  }
}
```

### Use the error object or extend it

In JavaScript, you can technically use the `throw` keyword with any data type. The fact that you’re not limited to throwing errors has been used by libraries and tools to implement complex functionalities. But when it comes to error handling it’s important to stick to the built-in `Error` object to preserve the stack trace and ensure interoperability between modules (if something is making `instanceof` checks for example).

```js
// 👎 Don't throw plain error messages
const { error } = schema.validate(req.body)

if (!product) {
  throw 'The request is not valid!'
}

// 👍 Use the built-in Error object
const { error } = schema.validate(req.body)

if (!product) {
  throw new Error('The request is not valid')
}
```

But sometimes passing just an error message is not enough. It’s a good practice to add additional details to the error like a status code that should be propagated to your application’s transport layer. In such cases, it makes sense to extend the Error object and attach these properties.

```js
// Extend the built-in Error object
export default class AppError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

// Use AppError instead
const { error } = schema.validate(req.body)

if (!product) {
  throw new AppError(
    httpStatus.UNPROCESSABLE_ENTITY,
    'The request is not valid'
  )
}
```

Notice the `isOperational` flag that is set to `true` by default. It’s used to distinguish between known errors raised by us and other ones that we don’t know how to handle.

There are two ways to extend the error object - either to create a more generic `AppError` or create specific error classes depending on the type like `ValidationError`, `InternalServerError`. I’d suggest sticking with a more generic error instance and passing the status code since most often this is the only difference between them.

### Listen to process signals

Most applications are built to react to external events - a request over HTTP or a message coming from an event bus. But they also need to be able to react to the environment they’re running in. The operating system will send signals to your application, notifying it of various events.

```js
process.on('uncaughtException', (err) => {
  // Log the exception and exit
})

process.on('SIGTERM', () => {
  // Do something and exit
})
```

Most notably you want to know when your service is about to get shut down so you can close the open connection to another service for example.

### Centralize error handling

It’s important to have a clear consistent strategy about error handling, not just handle exceptions on an ad hoc basis. When it comes to Express-based applications it’s much easier to establish a unified error handling module.

It’s rare to have a single engineer working on a service and by establishing specific practices you make sure that errors and exceptional cases are handled correctly. This reduces the responsibilities of your application, delegating a part of them to the error handler.

```js
// 👎 Don't handle errors on a case-by-case basis
const createUserHandler = async (req, res) => {
  // ...
  try {
    await userService.createNewUser(user)
  } catch (err) {
    logger.error(err)
    mailer.sendMail(
      configuration.adminMail,
      'Critical error occured',
      err
    )
    res.status(500).send({ message: 'Error creating user' })
  }
}

// 👍 Propagate the error to a central error handler
const handleError = (err, res) => {
  logger.error(err)
  sendCriticalErrorNotification()

  if (!err.isOperational) {
    // Shut down the application if it's not an AppError
  }

  res.status(err.statusCode).send(err.message)
}

const createUserHandler = async (req, res, next) => {
  // ...
  try {
    await userService.createNewUser(user)
  } catch (err) {
    next(err)
  }
}

app.use(async (err, req, res, next) => {
  handleError(err, res)
})

process.on('uncaughtException', (error) => {
  handleError(error)
})
```

The error handling mechanism must be put in place once and the core of your application should only be concerned with raising the proper error. It’s still important to keep boundaries between the layers. Your domain logic should use the regular `Error` object and if you need to enrich it, do so in the transport layer.

### Send 404 response in middleware

If you are using a middleware-based router like Express, the easiest way to handle a 404 error is to add a middleware that gets executed after all your routes. This way, if it’s ever reached without an error being passed to it, then no route was ever executed and you can safely rase a 404 error from there, which will be handled by the central error handler.

```js
app.use((err, req, res, next) => {
  if (!err) {
    next(new AppError(httpStatus.NOT_FOUND, 'Not found'))
  }
})
```

### Don't send error responses in the handler

If you have an established centralized error handling module, you should delegate handler errors to it as well. I find the transport logic easier to follow if it just throws an error instead of handling the response there. It also helps you to stay on the “happy path” of execution, not branching off into handling every case where something could go wrong.

### Shut down the app when you can't recover

The best thing to do when you encounter an error that you can’t handle is to log it and let the application shut down the application gracefully. We know how to handle a transport-level error or one in the domain logic, but if a library or a tool fails and we don’t know how to recover from it, it’s best not to make any assumptions.

```js
process.on('uncaughtException', (error) => {
  handleError(error)

  if (!isOperational(error)) {
    process.exit(1)
  }
})
```

Make sure the error is logged, let the application shut down, and rely on the environment to restart it.

### Enforce consistency

Being consistent with your coding standard is more important than what standard you use. There aren’t great functional differences between them, so this decision is a matter of taste and habits. It took me a lot of time to understand that when it comes to code style, you can never please everyone.

There will always be a developer whose taste differs from the group no matter what standard you decide on. So to avoid bike-shedding and continue with your regular work, just pick one style and stick with it. Code standards give benefits only if they are applied across the whole application or system.

Eslint and Prettier are still the best tools to use. Ideally, you’d want a husky pre-commit hook as well, and again run the linters in your CI pipeline to make sure that badly formatted code can’t be pushed into the project.

But consistency goes beyond style and formatting. Consistent naming is critical for making sense of the code. But applying a single naming convention for your whole application can make it confusing. Instead, use different ones to create better intuition.

```js
// 1. Use all caps for constants
const CACHE_CONTROL_HEADER = 'public, max-age=300'

// 2. Use camel case for functions and variables
const createUserHandler = (req, res) => {}

// 3. Use pascal case for classes and models
class AppError extends Error {}

// 4. use kebab case for files and folders -> user-handler.js
```

### Co-locate functionality

There isn’t a “one fits all” way to structure each application. Even with the principles, I outlined in the points above you will undoubtedly face a situation in which you’re not sure where to put a file or a function.

It’s easy to decide where routes, handlers, and services should live when you’re designing your modules. But the functionality that doesn’t fit into these categories remains a problem. The rule that I follow when I’m unsure where to place something is to locate it close to wherever it’s used.

If it’s only used in one module, keep it there. If there are more that need it, move it up a level and create a common module to host that logic.

But even so, the amount of business logic can grow and a module can easily turn into a long list of files, making it impossible to find anything. These are the problems of MVC architectures that we were trying to avoid in the first place.

To make sure that this doesn’t happen, we should group the logic in sub-folders. For example, imagine that you have complicated logic to calculate the shipping cost of an order. It may be split into 4 or 5 files, but your service still only calls one of them - the main `calculateOrder` function.

```text
├── order
|   ├── order-handlers.js
|   ├── order-service.js
|   ├── order-queries.js
|   ├── order-handlers.test.js
|   ├── calculate-shipping.js
|   ├── calculate-shipping.test.js
|   ├── get-courier-cost.js
|   ├── calculate-packaging-cost.js
|   ├── calculate-discount.js
|   ├── is-free-shipping.js
|   ├── index.js
```

This is an over-the-top example since you probably won’t split your logic that granularly, but it illustrates the idea. It’s impossible to understand the relationship between these files when you look at them this way. Add some more functionality and it will become a mess.

To improve this structure we should just create a sub-folder (like a sub-module) about calculating the cost and moving all the functionality in there. Then the main entry point will be exported from an `index.js` file and the services will refer to the module itself instead of a specific file.

```text
├── order
|   ├── order-handlers.js
|   ├── order-service.js
|   ├── order-queries.js
|   ├── order-handlers.test.js
|   ├── calculate-shipping
|   |   ├── index.js
|   |   ├── calculate-shipping.js
|   |   ├── calculate-shipping.test.js
|   |   ├── get-courier-cost.js
|   |   ├── calculate-packaging-cost.js
|   |   ├── calculate-discount.js
|   |   ├── is-free-shipping.js
|   ├── index.js
```

### Keep routes in modules

In the same way, a module should hold all its logic, it should also own all its routes. Many applications create modularity only to break it by listing all routes together in a single file. While this is easy to understand it also means that multiple engineers may be touching the same file and this is something that we want to avoid.

```js
// Register the main routes
const router = express.Router()

router.use('/user', jobs)
app.use('/v1', router)

// user-routes.js
router.route('/').get(isAuthenticated, handler.getUserDetails)
router
  .route('/')
  .put(
    isAuthenticated,
    validate(userDetailsSchema),
    handler.updateUserDetails
  )
```

Defining routes in a single place doesn’t seem like that big of a problem when it comes to modularity. After all, these modules must integrate somehow. But unfortunately, most route definitions carry with them not only the handlers but the middleware that should be executed first.

Frameworks like Express allow you to chain routers in a routing tree so you can encapsulate the routing logic for each module. As a side-effect, it makes extracting a module into its own separate application even easier.

### Prefix API routes

It will take a long time for gRPC and GraphQL to reach the level of adoption of REST as a pattern. We will still be building regular APIs in the foreseeable future so it’s worth investing the time in understanding how to utilize REST.

A problem that APIs with a lot of clients have is ensuring stability and managing breaking changes. Changing the parameters that an endpoint expects becomes a risky undertaking. Even though you can manage this with tools like Pact, you will undoubtedly reach a point when you will **have** to make a change in your API.

To ensure backward compatibility, always prefix your routes with the current API version, even if you don’t have plans to make drastic changes. All your clients will use this endpoint, effectively applying versioning to their calls. Creating a new version that isn’t compatible with the first one becomes painless.

```js
app.use('/v1', routes)
```

### Attach the user for authenticated requests

Whenever you are handling a request that requires the user to be authenticated you will most likely need some of its data. It can be the id, the email, or their settings. To avoid making subsequent requests to reconstruct the user object from a token, once you authenticate the user, attach the object to `res.locals` so you can access it in the middleware and handlers down the chain.

The `res.locals` property is useful for TypeScript users because it’s typed as `Record<string, any>` so you won’t be fighting type errors to access it. An alternative is to attach the user directly to `req` and access it by referencing `req.user` but I consider the `res.locals` approach to be easier in regards to types.

The problem with both approaches is that you lose static type checking. To ensure that TS is using the right types for the user object you will need to utilize declaration merging and add it to the `Request` or `Response` object.

### Avoid callback-based APIs

Before promises became a member of JavaScript’s standard library and got wide support, Node relied on callback-based APIs for its asynchronous features. On its own, this is not a bad design, but in a normal logical flow, we may have to use multiple callbacks nested inside one another, quickly making our implementation take the form of a Christmas tree.

The deep indentation makes the code harder to follow. It’s not that easy to distinguish which callback a line of code falls into. This is the famous “callback hell” problem that was the scourge of any Node codebase.

Thankfully, promises relieved us of this problem. Now the built-in Node modules have promise-based APIs that we can use with `.then()` or `await`.

```js
// 👎 Do not use callback-based APIs to avoid deep nesting
import fs from 'node:fs'

fs.open('./some/file/to/read', (err, file) => {
  // Handle error...

  // Do something with the file...

  fs.close(file, (err) => {
    // Handle closing error...
  })
})

// 👍 Use promise-based APIs
import { open } from 'node:fs/promises'

const file = await open('./some/file/to/read')

// Do something with the file...

await file.close()
```

You still need to handle the potential errors by using `try/catch` or chaining the `.catch()` method on the returned promise.

## Tooling

Every application is a symbiotic relationship between your code and a lot of tools written by developers you might never get the chance to talk to. Knowing what trade-offs to make and how to integrate the domain logic with the 3rd party libraries you’re using is paramount for your application’s quality.

### Favor minimalistic tooling

Node’s philosophy is centered around minimalistic tools that provide you with the building blocks to build what you need. Engineers joke about the sheer number of NPM modules one must install to create a service with everything they need.

But that’s the idea that the ecosystem was built around - small modules that focus on only one thing. It’s up to the engineer to decide whether to implement or pull what they need.

Express is a perfect example of Node’s minimalistic philosophy - it’s not an accident that it remains the most popular framework. It implements the fundamental functionality that you need to get a server going and what you add on top of it is in your hands.

### Favor Express as a framework

I recommend sticking to Express because its plugin, routing, and middleware patterns are the backbone of every other framework that you may have to use in your work. A more opinionated tool may provide you with some functionality on top of it.

Learning Express will teach you how to make trade-offs and pick the tools you need, how to structure an application, and not to limit your thinking in a particular framework’s context. Regardless of the tools you work with in the future, you will be able to take advantage of this knowledge.

Most general-purpose languages have a dominant framework - Ruby has Rails, Python has Django, PHP has Laravel. They are all shaped around the philosophies of their ecosystems. In 2022, Node is still synonymous with Express.

Still, many opinionated frameworks aim to provide people with a batteries-included solution. They have a certain level of adoption but their approach conflicts with the fundamental ideas of the Node.

Nest is a notable framework that has received a good level of adoption and is preferred in enterprise companies. Fastify is a framework similar to Express in its philosophy but provides more tools out of the box.

But googling anything related to building a Node service will most likely show results related to Express.

Express is the lowest common denominator between all available tools and frameworks because of its minimalism. As a person looking to improve their Node knowledge, focusing on Express gives the best return for your investment of time. Building applications on top of Express will teach you the most because of the control you have.

Express gives you the freedom to structure your application based on your understanding and requirements. Building with it is akin to building without a framework. You can easily go and read Express’s source code - the implementation is not that big and it’s written in an easily understandable way.

### Favor query builders to ORMs

ORMs are widely popular in other languages but they don’t have the same level of adoption in Node. You won’t find a clear winner or a go-to ORM and in fact, many Node developers will encourage you to use a lighter option like a query builder.

ORMs work great at a lower level of complexity. As long as you stick to simple operations and joins they won’t get in your way. At that level of complexity, they make your code a lot more readable and intuitive, compared to the corresponding SQL queries. They help to standardize how data is fetched throughout the team since developers may have their own preference of how to write a query.

The big problem with ORM is that the threshold where they start hindering you is quite low.

Complex queries require an understanding of the ORM’s API. While most engineers are familiar with SQL, they may have to look up how a function works. But this is a negligible flaw. The real problem is that ORMs may not generate performant complex queries and they are hard to benchmark and optimize. It’s not uncommon for developers to ditch the ORM and write queries by hand once this becomes the case.

Another reason I’m not in favor of ORMs is they introduce another level of coupling between the modules in your application. Ideally, you’d like the modules to communicate using the services you create in each one. Tying up the models together makes it harder to extract a module into its own service in the future.

ORMs have the downside of shaping your logic around them, relying on lifecycle hooks or validation mechanisms that are not obvious for people who do not know the tools. The ORM blurs the line between logic and data access.

For those reasons, I advise people to skip the ORM and go for a lightweight option that gives better control over the database querying. A query builder is a good alternative that will save you the hassle of binding values but still give you better control over how you fetch your data. Knex is a proven tool that I’m in favor of using when it comes to SQL, and Mongo has its own driver.

Perhaps the only ORM-like tool that I would be in favor of using is Prisma.

### Favor native methods to libraries

When benchmarked against the native methods, functions in libraries like `lodash` and `underscore` have shown to be less performant. At the same time, they add an extra dependency to your project. When these libraries were first created they aimed to fill a gap between the needs of the developers and the capabilities of the language.

Now, most of the functionality you may import a library for is built into the language. Methods like `Object.entities`, `Object.keys`, `Object.values`, `Object.find`, `Array.from`, `Array.concat`, `Array.fill`, `Array.filter`, `Array.map` and their compositions will be able to cover most of your needs.

I’d recommend taking advantage of the language’s features and building your own reusable utility functions. In fact, you can find examples for most of them written using the modern native methods, including complex functions like a recursive `flatMap`.

### Extracting libraries

When your application consists of a single monolithic Node service, reusing logic is as easy as importing a function. To maintain modularity you might want to put the common functionality together, but that’s about it.

When your application is split into multiple services, this shared logic becomes a pressing problem. Developers find themselves repeating functionality from service to service and because of the famous DRY (Don’t Repeat Yourself) principle they immediately look for a way to create an abstraction.

There are two possible solutions to the problem - creating another service that provides this functionality or extracting it as a library. The former is avoided as an approach because adding yet another service and infrastructure around it is a big burden. But the latter seems like a good solution to the problem of repetition.

There are a few things to keep in mind though. When you have multiple independent services, keeping them decoupled is of critical importance - even if it is at the cost of duplication. By introducing a shared library you increase the level of coupling. Still, this problem can be alleviated by using versioning and fixing the library version that each service requires.

But it’s worth considering the pace of change of the logic you want to extract. If the logic you aim to encapsulate is under rapid development, duplication would be easier to manage than constant updates to the library and the services that use it.

### Use a structured logger

Logging is the only way to trace the logical flow of your application in production. The simplest approach is to use `console.log` and log an arbitrarily structured message that contains the information you need. You can fit all the information you need in it like time, caller, error message, and important business-specific information.

But this kind of logging is useful only to an engineer who can personally browse through the messages. An application with high traffic can generate enough logs to bury yourself in, so going through them by hand is not ideal in any way.

It’s better to use a structured logger that can output messages in a format digestible by machines. It’s easier to configure and impose a structure on the logs. Also, you will get the benefit of being able to search through them using a tool like Splunk or New Relic.

Especially in service-oriented or microservice-based systems, being able to quickly make sense of the flow of data is critical. Plus, it gives you the ability to add alarms if error logs appear for your service.

The most widely used logger is `winston` and I think you won’t go wrong if you use it. However, the community seems to be moving away from it slowly since it’s known to have certain flaws and it hasn’t got updates in a while. For those that don’t want to use `winston`, I’d recommend `pino` - it’s actually the default logger used in `fastify` (another popular Node framework).

### Document the application

Creating an application or a service is just the initial part of its development life. Going to production means that from here on the code you’ve written will have to be maintained. Most often the people who extend and modify a service are not the people who have created it.

To make sure that developers without context understand the implementation it’s important to write comments that answer the question “why” something is done. I find comments especially useful in the business layer since that’s the part of your service people will have the least knowledge about.

Engineers will understand the HTTP layer and the database one - there’s plenty of documentation for the tools you’re using. But understanding the business layer is hard, even for people who are familiar with it. Engineers emphasize self-documenting code but I don’t think it’s enough.

It’s also worth documenting the endpoints your service has, the payloads it expects, and the response format it returns. Swagger is a good tool to use and its widely adopted in the community. It can visualize the documentation for easier browsing and there are tools that can generate TypeScript types from it so you can share them with clients.

### Pin dependency versions

This is often overlooked, but make sure you pin the NPM packages to the exact version that you’re using. Don’t rely on semantic versioning to ensure that you won’t be getting any breaking changes. This means that you will have to put a task in your backlog to do an audit and update packages every few months but safety is worth the manual work.

### Use TypeScript

A few years ago I had to make a case for TypeScript at work. I remember putting together a whole proof of concept together with a pros/cons list and estimations. People were afraid of the learning curve and the potential productivity hit from the type system.

Nowadays TypeScript’s benefits have been widely proven, the tooling around it is mature and IDE support is great. Most packages are shipped with types, so the situations where you have to create them yourself are rare.

Pure JavaScript lets you move faster when you’re working alone. TypeScript lets you move faster when you’re working in a team. There is no reason not to use it.

### Use Snyk

The Log4j fiasco taught us that even something as simple as a logger can potentially be used as a vector of attack. In a system spanning many services, it becomes impossible to keep track of what is affected by a discovered vulnerability. Security checks must be automated so you can get an early warning and keep track of what is affected.

Snyk is a great tool that can warn you about known problems in the libraries that you’re using. The best way to use it is to run it as a step in your CI pipeline and potentially block the release if there’s a vulnerability found.

However, it’s important to note that it’s best to configure Snyk to only report critical or severe vulnerabilities. Many of the libraries you use will have low-impact problems that can’t be addressed. Having Snyk report them will bring a lot of noise to your pipeline and you will eventually start ignoring it.

Instead, configure the tool to raise the alarm only when it detects a severe problem.

### Containerize the application

The gnarliest bugs are those caused by environment-specifics that can’t be reproduced easily. Thankfully, container technology is widely adopted and mature so we can avoid some of these problems.

Running your application in a container ensures that you have control over the environment in which it runs and reduces the chance for you to encounter a problem once you go to production.

However, I believe that using a tool like Docker can be unnecessary in some cases. One of them is when you don’t have other services that you need to spin up. The other is when your application is not deployed in a containerized environment. In such cases, I would strongly suggest sticking to the npm scripts and avoiding the extra abstraction.

But containers shine when you need to spin up a few different services locally, like a database, a Redis cache, and perhaps a front-end application. If your application depends on multiple services then using `docker-compose` is the easiest way to run them locally and have a reproducible environment between team members.

### Do not worry about database changes

You will never have to change your database and if someone comes to you asking you to consider it in the middle of a project, I’d suggest you send them on their way. Unless such a change would give you between 5 to 10 times improvement in speed or cost, I’d advise you not even to consider undertaking that initiative.

The possibility of changing a critical piece of infrastructure is a great cause of over-engineering. Teams end up adding unnecessary abstractions and increasing the complexity, preparing for events that are very unlikely to happen.

If you ever find yourself in a situation in which you need to change the storage of an application while it’s in production, your greatest challenge will be migrating the data from one store to another. Abstracting the database specifics from your code will be far easier.

### Encapsulate configuration

Mishandling configuration can silently raise the complexity of an application. Each service requires several API keys, credentials, and environment variables to be provided to it so it can function properly.

Using such environment variables directly into a service or handler breaks the boundaries between the layers. It turns simple pure functions that get parameters and return data, into impure ones that rely on external data to be passed to them.

```js
const config = {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
}

export default config
```

This allows you to encapsulate the configuration and import it like any other module. The handlers and services remain oblivious of where exactly a value is coming from. It could be set with an environment variable or even hardcoded in the object (if it’s something like an AWS region).

To avoid breaking the purity of the functions, I like to import the `config` object on a higher level in the application and pass the values as parameters to the function. This makes them easier to test.

### Use hierarchical config

Environment variables are easy to manage when they are only a few. But each component your application needs to communicate with may require multiple configuration variables.

Connecting to a database usually requires credentials, a database name, and possibly a region. Add the required variables for a cache together with API keys for external services and you end up with quite the list.

These variables become hard to distinguish and we usually resort to prefixing them with a common identifier to make sense of what belongs to what. In such cases, we should encapsulate the config and create a hierarchy in it.

Then we can use the common design principle to not repeat the name of the object in the properties we hold.

```js
// 👎 The object name already holds the context
const user = {
  userName: '...',
  userEmail: '...',
  userAddress: '...',
}

// 👍 Remove the unnecessary prefix
const user = {
  name: '...',
  email: '...',
  address: '...',
}
```

If we apply this to our configuration, we get an easy to understand object.

```js
const config = {
  storage: {
    bucketName: process.env.S3_BUCKET_NAME,
  },
  database: {
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
}

export default config
```

## Testing

We have no way to validate if an application works as expected if it’s not covered by tests. Still, tests are code that needs to be structured well and maintained.

### Favor integration testing

The tests that produce the most value by far are the integration ones. They validate if a complete logical flow in your application works as expected and it handles the business operations. Having confidence that your service behaves as expected in production should take precedence over testing each function separately.

One of the most common problems is that all unit tests pass successfully but the integration between them fails, leaving the application unable to serve its purpose.

As engineers, we are often pressed with time and despite the clear benefits of testing, they are often overlooked. If you only have limited resources to spend on testing, consider focusing on integration tests before everything else.

They are the best way to ensure the stability of your application and even though they are not precise in diagnosing the exact cause of a problem, integration tests ensure wider coverage.

### Consider dependency injection over mocking

In some languages, having to mock a dependency is considered a code smell. Having to mock something means that the code is written in a non-flexible way that will be hard to extend and modify. In general, everything that makes testing harder should be considered a potential problem with the implementation.

In the Node community, we’ve accepted mocking as a regular practice. Most testing tools encourage it by providing useful methods to mock entire modules or specific functions from them.

An example is a service importing a logger module directly to use it. This couples the service to the logger, making it unable to work with a different one that follows the same interface. When testing, we mock the entire module.

An alternative is to inject them into the service by using a factory function to create it. We can use it to pass everything external the service relies on and testing becomes a tad bit easier since we can create the service with simple objects instead of relying on mocks.

I can’t advocate for one or the other. Mocking is a widely used and recognizable practice so using it in Node applications is fine. But injecting dependencies is a powerful way to decouple your application and I’m becoming more and more fond of it.

One thing I can recommend, though, is avoiding complex dependency injection containers. They introduce a lot of complexity at the price of less verbosity.

### Unit test the business logic

In the HTTP and data access layers, you will rely on third-party libraries. You will probably use a framework like Express to handle routing and a database client to access your storage. These tools come with a solid test suite that guarantees they work as expected.

What you should focus on is testing the domain layer. You should make sure your business logic behaves as expected because it’s the part of your application that is solely under your control.

### Invest in high test coverage

I spent years doubting the effectiveness of tests past a certain threshold. I believed that test coverage gives diminishing returns once the main logical paths are covered. I held this opinion until recently when I saw a codebase with 100% test coverage for the first time.

Coincidentally this is a team that had 0 production incidents in the last six months. There is a strong correlation between test coverage and reduced incident count. For this team, it meant that each line in their application had been validated to work as expected.

Of course, this was in an enterprise that has the time and resources to invest in proper testing. But it was the initiative of the developers that raised the test coverage that much.

Even if the environment you work in doesn’t allow you to test everything, take the time to add a test whenever you’re changing something or adding a new feature. It’s up to engineers to educate the organization about the benefits of this practice.

### Follow the Arrange-Act-Assert pattern

The Arrange-Act-Assert pattern is commonly used to structure tests regardless of the language or testing framework that you’re using. Tests are code that has to be maintained so we should put effort into making it maintainable and understandable.

```js
describe('User Service', () => {
  it('Should create a user given correct data', async () => {
    // 1. Arrange - prepare the data, create any objects you need
    const mockUser = {
      // ...
    }
    const userService = createUserService(
      mockLogger,
      mockQueryBuilder
    )

    // 2. Act - execute the logic that you're testing
    const result = userService.create(mockUser)

    // 3. Assert - validate the expected result
    expect(mockLogger).toHaveBeenCalled()
    expect(mockQueryBuilder).toHaveBeenCalled()
    expect(result).toEqual(/** ... */)
  })
})
```

## Performance

Performance is a topic broad enough to warrant a book on its own. But it’s important to keep a few principles in your day-to-day work to avoid common problems. Improving speed is often about doing less, not doing more.

### Don't block the event loop

Node can give stunning performance when used correctly. A simple rule that you should follow is to use Node when your problem requires many operations that are small in size. I will avoid diving into the details of the Event Loop but it’s important to know that it runs on a single thread, constantly switching between tasks.

When it reaches an asynchronous task it can put it aside and work on something else until the previous task is resolved. But if you run long, CPU-intensive operations it will work on one task too long, making others wait. The rule of thumb is not to block the event loop for expensive operations so we can utilize its switching mechanism to its full extent.

Such blocking operations may be parsing a large JSON object, applying logic over large collections of data, running complex regexes, and reading files. If your application needs to handle such operations in a performant manner, you should look into ways of offloading them from the main app into an external queue. If performance is critical and you have to do expensive operations that can’t be put on a queue, then it’s worth reconsidering the choice of Node.

For the same reason, it’s best to avoid serving assets from a Node server. HTML, CSS, JS files, and images are best served by a CDN or even an S3 bucket. Node shines brightest when we use it for IO-heavy workloads. If used properly, Node’s single-threaded event loop can be as performant as an application taking advantage of multiple threads.

### Don't optimize for algorithmic complexity

You will find that for most services, the time which your code takes to execute will be the least impactful factor when it comes to performance. The situations in which the algorithmic complexity of your business logic is the biggest bottleneck in your application are so rare that you can disregard them at least initially.

This is not to say that you should write code with no considerations about speed, but that you shouldn’t rush to optimize this when there are other dominant factors. It’s not a productive way to spend your time when you could be creating a lot more value if you optimize other things.

The thing you should focus on the most is communication with external services. This means both databases and other applications that you communicate with. The extent to which your queries take advantage of your database’s design is something you should be incredibly vigilant about.

A slow query will cripple your response times so much that no matter how slick your code is, it couldn’t compensate. It’s important to take advantage of indexes and access data in the most performant ways allowed by your database. That’s why I advocate for the use of query builders instead of ORMs even in simple scenarios.

The second problem is the communication with external services. Whenever a network request is involved, the chance for problems is higher than zero. The speed with which other applications or vendors respond to your requests is another factor worth focusing on.

Of course, it’s impossible to have control over the network but you can employ tactics such as keeping the HTTP connection alive to skip the handshake time on subsequent requests, you can consider implementing a cache (whether an in-memory one or something like Redis) to avoid making duplicate requests, or you can consider request batching and sending multiple requests at once.

### Don't optimize prematurely

There’s a famous quote in software engineering that premature optimization is the root of all evil and most experienced developers will agree. Performance is important, but trying to shave off a few milliseconds from a request that will have no impact on the clients is not a good way to spend your time.

You should keep the considerations mentioned above when you’re writing a Node service, but do not look for ways to improve the execution speed of your code unless there’s a problem. Make sure there’s a problem before you even start doing benchmarks and investigating.

Occasional slow requests shouldn’t be a cause for concern, they could be caused by a network problem. But if a handler is consistently slow - investigate before you start making improvements. Make sure you’ve got the root cause whose fix will have an impact on performance.

Something that you should be careful of is if the response time for a handler is rising linearly with the number of requests coming in. This is a big tell that your application won’t perform well under high volume.
