# CommandErrored

This is a "catch all" command error event definition + handler, the idea being
that we can take action on any domain error, in any package.

We might want a different one for exceptions, the difference is that 
the command errored one contains domain info, and knows the caller, 
while a catch-all exception one has no information about the caller and should
go into a generic outbox.