# Vision

This module is responsible for identifying objects via picam and run logic
based on the result.

Current plan is to used to trigger an snapshot when a motion detector has
a reading. Eventually the snapshot could be used with image classification
to identify if it is a human or an animal, and which kind, and react based
on that.

# TODO
1. Write the mqtt controller for this
2. Also write a long-running service that reacts to proximity by running the
   take picture and classify command