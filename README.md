
# Redux Infinity State

## Implementation of redux patern


## Install

Redux-infinity-state is a package that aims to make application side effects and the actions easier to manage, more efficient to execute. 

`yarn add redux-infinity-state`

## Motivation

We all know that redux is an important part of the React ecosystem, even if the application has complex flux and asynchronous actions. With Redux, the management state and data synchronization between components are eased.

But in many cases, the exceeding code around the redux ecosystem makes the code hard to understand and maintain. This sensation increases when we realize that the code is repetitive, especially when many actions are written.

Another factor that discourages the use of Redux is when we need to deal with asynchronous flows. In these cases is necessary at least one of the following libraries to solve the problem: Redux-Saga, Redux-Thunk, or Redux-Observable. They are good solutions and do this job very well, but the synchronous code is splitted from the asynchronous, which is a nice approach, but the code becomes confused and not natural.

## The proposed solution

The redux-infinity-state comes to solve some problems mentioned and makes Redux use easier, making your code more organized and simple.

# Table of contents

* [Introduction](README.md)
* [Read Me](read-me.md)
* [Getting started](getting-started.md)

## Usage

* [Creating Synchronous Handles](usage/creating-handles.md)
* [Creating Asynchronous Handles](usage/creating-asynchronous-handles.md)
* [Registering Handlers](usage/registering-handlers.md)
* [In the components](usage/in-the-components.md)
* [Add the middleware](usage/add-the-middleware.md)
* [Testing](testing.md)

## Read me [https://juciano.gitbook.io/redux-infinity-state](https://juciano.gitbook.io/redux-infinity-state/)

