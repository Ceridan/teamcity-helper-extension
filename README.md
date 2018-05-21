# TeamCity Helper Extension overview

**TeamCity Helper Extension** is a chrome extension which adds some additional functionality to the [TeamCity](https://www.jetbrains.com/teamcity/) UI.

### What problem does it solve
When you use TeamCity on the everyday basis you face lacking features in the TeamCity UI. For example, when you work with triggers you often need possibility to copy triggers, but you TeamCity doesn't provide this function. It is not critical, but it takes some time to create new trigger and fill it's card. Another example, when you analyze failed UI tests on the build overview tab, it would be probably better if your screenshots are shown following by the stacktrace, rather than as separate artifacts. TeamCity Helper Extension is designed to cover such of this problems.

## CAUTION
TeamCity Helper Extension is using [TeamCity REST API](https://confluence.jetbrains.com/display/TCD10/REST+API) to add some features to the TeamCity UI. To use such features you should provide credentials to access REST API. Generally it is not very good idea to give the access to your TeamCity REST API to the external applications, because it could harm your TeamCity builds. So, do it with caution. You also may validate the source code of the TeamCity Helper Extension on GitHub and build your own copy of the extension.