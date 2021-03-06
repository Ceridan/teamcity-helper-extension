# TeamCity Helper Extension overview

**TeamCity Helper Extension** is a chrome extension which adds some additional functionality to the [TeamCity](https://www.jetbrains.com/teamcity/) UI.

You may install TeamCity Helper Extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/teamcity-helper/jngfchollnejmhmaeobpmijfkildpkag)

## What problem does it solve?
When you use TeamCity on the everyday basis you face lacking features in the TeamCity UI. For example, when you work with triggers you often need possibility to copy triggers, but you TeamCity doesn't provide this function. It is not critical, but it takes some time to create new trigger and fill it's card. Another example, when you analyze failed UI tests on the build overview tab, it would be probably better if your screenshots are shown following by the stacktrace, rather than as separate artifacts. TeamCity Helper Extension is designed to cover such of this problems.

> ## CAUTION
> TeamCity Helper Extension is using [TeamCity REST API](https://confluence.jetbrains.com/display/TCD10/REST+API) to add some features to the TeamCity UI. To use such features you should provide credentials to access REST API. Generally it is not very good idea to give the access to your TeamCity REST API to the external applications, because it could harm your TeamCity builds. So, do it with caution. You also may validate the source code of the TeamCity Helper Extension on GitHub and build your own copy of the extension. TeamCityHelper Extension stores you REST API key using [Chrome Storage API](https://developer.chrome.com/extensions/storage) locally on your machine and uses it only for the TeamCity REST API requests.

## Teamcity version compatibility

* [master](https://github.com/Ceridan/teamcity-helper-extension/tree/master) branch contains latest version of the code and currently targeted to TeamCity 2018.1
* [teamcity-2017.2](https://github.com/Ceridan/teamcity-helper-extension/tree/teamcity-2017.2) branch targeted to TeamCity 2017.2 and no longer supported

# How to build project

## Prerequisites
* [Google Chrome](https://www.google.com/chrome/) browser
* [Node.js](https://nodejs.org/en/) installed on your machine

## Set Up
1. Clone the repository
```
$ git clone https://github.com/ceridan/teamcity-helper-extension.git
$ cd teamicty-helper-extension
```

2. Restore packages
```
$ npm install
```

## Build project
Now you have two options how to build project
1. Build in production mode (size of the bundle will be as small as possible)
```
$ npm run build
```

2. Build in development mode (with source map and watcher which allows you to change code on the fly without manual rebuild and debug in browser)
```
$ npm run dev
```

In both cases build will create `dist` folder with all artifacts required for the extenson.

Also you may run tests only
```
$ npm run test
```

## Upload your extension to the browser
Now you are ready to upload your extension to the browser
1. Open [Chrome Extensions](chrome://extensions/) page in your browser
2. Toggle Developer Mode switch in the top right corner
3. Choose `LOAD UNPACKED` option
4. Browse for `dist` folder builded in the previous step and choose it


> If you want to modify source code of the extension you need to refresh the extension on the Chrome Extensions page on each code changes.


# Supported features

* [Inline screenshots for failed tests](#Inline-screenshots-for-failed-tests)
* [Trigger copy function (REST API authorization required)](#Trigger-copy-function)


## Inline screenshots for failed tests
When you run UI Tests drived by Selenium for example you may want to collect screenshots to determine which problems Selenium driver encountered and failed the test. TeamCity provides the conventional method to collect artifacts and store it in one place - artifacts tab. But when you have to resolve problems with a bunch of failed tests you spend some time on switching between stack traces and screenshots. Inline screenshots feature solves this problem and allows you to see the screenshot and stac ktrace in one place on the build overview tab.

### How does it work?
This feature depends on [TeamCity build script interaction](https://confluence.jetbrains.com/display/TCD10/Build+Script+Interaction+with+TeamCity) which allows to publish the screenshot from your code. This way of screenshot publishing also printed to the stack trace. Inline screenshots feature uses stack trace to find teamcity service message and create mapping between the stack trace and published artifact. Based on this mapping TeamCity Helper Extension adds image element to the DOM after the stack trace element and sets image src attribute to artifact path.

To use this feature you need to output proper TeamCity service message to publish your screenshot:
```
##teamcity[publishArtifacts '/BuildAgent/Screenshot/Full/Path/image.png => screenshots']
```
Here is C# code example using [NUnit TestContext](https://github.com/nunit/docs/wiki/TestContext) to create such output:
```
TestContext.WriteLine($"##teamcity[publishArtifacts '{screenshotFullPath} => screenshots']");
```

## Trigger copy function

> REST API authorization required. You should add REST API credentials on the extension options page. It will be shown automatically when you try to use this feature.

Unfortunatly the triggers table doesn't allow to copy triggers and when you need to add a bunch of triggers with the same parameters (for example, to run  builds on schedule) you should create and fill trigger card every time. Trigger copy feature allows you to simplify this procedure and create full copy of the selected trigger and add it to the end of the triggers table.

![Trigger copy function in action](/screenshots/tchelper-trigger-copy-feature.png)

### How does it work?
Actually it uses TeamCity REST API under the hood. REST API allows you to get trigger info and to add new trigger. Combining this two methods we can read information about selected trigger and add it as a new trigger.


## Feature toggling

TeamCity Helper Extension supports feature toggling, so you may disable some features and use only those you like. To enable/disable features you need to open extension options page and check/uncheck features. All features are enabled by default.

![Extension options](/screenshots/tc-options.png)

# Special thanks to
[Dodo Pizza](http://dodofranchise.com) team. The idea of this project was born while spending hours with TeamCity in Dodo and I have felt all the pains of the TeamCity UI by myself. I am very proud to be a part of such a great company. Guys you are amazing!