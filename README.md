# Topology visualiser - engineering degree project

## Instruction to run locally
### Prerequisites
To run the project we need to have installed node.js and node package manager (npm):
* https://nodejs.org/en/download/ - install node and npm (they come togheter with most installations on this site)

Please make sure through cmd/Powershell/terminal that it was successfully installed and commangs are recognized:
```
npm --version
node --version
```
### Downloading repository
In that step we need to use any technique to download folder with the whole repository to our local folder. We may for example download it just as a .zip:

![image](https://user-images.githubusercontent.com/29756131/141644871-499c5c00-8812-4d8c-acfd-8cbbde285da1.png)

Please notice that repo contains three library and may have significant weight.

### Install packages and run locally
Even though many of the libraries are accessed via CDN, still some of them needs to be installed locally. To achieve it, configuration which libraries are needed is stored in package.json file which might change in time in future if other dependencies are needed. To install those dependencies locally, we need to navigate in terminal to folder with a project and run:
```
npm install
```
It shall download dependencies specified in package.json:

![image](https://user-images.githubusercontent.com/29756131/141645411-112e156e-455a-49ae-a0c5-ba16d195347b.png)

Now we can try to run server and start application. From main repo folder (where app.js is located) just run:

```
node app.js
```

Please, notice that app is by default listening on port 5000. Make sure that other app is not running on it or change it in app.js.

![image](https://user-images.githubusercontent.com/29756131/141645557-a6894918-ae7c-4efa-b2ab-f438b63bbd1c.png)

Now, we may go to browser and access our app:
![image](https://user-images.githubusercontent.com/29756131/141645600-40aee562-58c0-465f-bcb7-6146d3947f2c.png)



