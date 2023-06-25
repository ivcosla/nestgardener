# Packages

Packages contain modules that we consider "Bounded Contexts". Top level
packages should not import each other, they have to be decoupled.

If they need to execute each other's logic, they should use the CommandBus to,
however this means a level of interdependency that is better to be avoided.

The main communication channel between bounded contexts is the EventsBus. This
means that any bounded context can subscribe and react to Domain Events emitted
by any other bounded context, but we should try to avoid commanding other
bounded context to do something.

Think of this as every bounded context should be ready to be split into a
microservice, where they can react to each other's event, but we should keep
their flows separate and clean, so a service A does not required to call a service B
in their flow, and wait for their response, however we can do it when we 
really need to.

You can also think of them as separate paths in your API, where you want them
to be decoupled by functionality, so /api/payments have nothing to do with 
/api/orders.

Then we have the "shared" directory, this one should contain modules that other
bounded context depend on. If you think of bounded context as microservices, then
"shared" would be dependencies to bundle into them.