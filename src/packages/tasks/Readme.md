# Tasks Module

The tasks module registers startup tasks and cron jobs, so we can either
boot some preconfigured workload on init, or periodic tasks.

The way it works is by running commands on other packages, so commands are
evaluated each time the cron runs. There are cases where we just want to run a
command that internally does periodic work. This kind of tasks are currently,
albeit configurable, non-stoppable, so the only way to reset them is rebooting
the thing.

So, in summary, we have tasks with type:
 - Setup: stuff like: start listening this sensor, in a continuous/non-periodic 
   way, but wheter it runs, and how runs on the Thing is configurable by the
   fleet manager.

 - Cron: Just cron, periodic or interval tasks. 

And you should prefer Cron jobs for controlling periodic tasks, but there is
always the possibility of running a single shot task with "Setup" type.

## Why is this module on Shared?

Because it indirectly executes commands in other modules, thus, it depends on
the bounded context under `packages`, meaning, if they were to be deployed
independently it would be better to bundle Tasks with them.