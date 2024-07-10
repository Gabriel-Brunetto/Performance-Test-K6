# K6 for Performance Testing

![alt text](/Assets/k6.png)

## Topics 

- <a href="#WhatisK6">What is K6</a>
- <a href="#firststeps">Install</a>
- <a href="#howtouse">Running K6</a>
- <a href="#howtouse">Tests In Serverest</a>

## What is K6 ?

Grafana k6 is an open source load testing tool that makes performance testing easy and productive for engineering teams. K6 is free, developer-centric, and extensible.

## Install

Before installing our K6 tool, we will need to install Chocolatey according to the instructions on the official website: </br>
>https://chocolatey.org/install

After that in your CMD insert the command:
>choco install k6

<strong>If you have a problem consulting:</strong> https://k6.io/docs/get-started/installation/troubleshooting/

## Running K6

Local Test

In your CMD paste the command `$ k6 new` and press enter

>This command creates a new script file called script.js in the current directory. You can also specify a different file name as an argument to the ok6 new command, for example k6 new my-test.js.

Execute o k6 com o seguinte comando: `$ k6 run script.js`

Add VUs - Now run a load test with more than one virtual user and a longer duration:
`$ k6 run --vus 10 --duration 30s script.js`

Set options - Instead of typing --vus 10e--duration 30s each time you run the script, you can set the options in your JavaScript file:

```js
import http from 'k6/http';
import { sleep } from 'k6';
export const options = {
  vus: 10,
  duration: '30s',
};
export default function () {
  http.get('http://test.k6.io');
  sleep(1);
}
```

And using the command: `$ k6 run script.js`

## Tests In Serverest

Tools Used:
- Node JS
- Chocolatey
- NPX
- VSCode
- K6
- Serverest

With all these tools installed we will start our API, to start our api we will type the following command in our terminal:
`npx serverest@latest` and the following screen will appear

![alt text](/Assets/cmd_serverest.png)

> Then we open our IDE and type the following script:

https://github.com/Gabriel-Brunetto/Performance-Test-K6/tree/main/Tests

<strong>NOTE: We have four (4) types of performance tests, it is recommended to study each type of test, but they all work as a form of flow along the Login, Users and Products route</strong>


After writing the script, we will open our IDE terminal by pressing `CTRL + "` and type `K6 run <filename.js>`

E obtivemos os seguintes resultados:

![alt text](/Assets/metricas_API.png)





