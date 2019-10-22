/**
 * Copyright 2013, 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// The `https` setting requires the `fs` module. Uncomment the following
// to make it available:
//var fs = require("fs");

const extend = require("extend");
const path = require("path");
const fs = require("fs");
const dextend = require("deep-extend");

process.env = process.env || {};
let config = getConfig(process.env);

let defaultSettings = getDefaultSettings(process);

let settings = getNodeRedSettings(process.env, config);
    settings.editorTheme = getEditorTheme(process.env);

defaultSettings = extend(defaultSettings, true, settings);

let finalSettings = getFinalSettings(process.env, defaultSettings);

module.exports = finalSettings;



function getConfig(env) {
  let config;
  try {
    let defaultUsers = [
      {
        username: "demo",
        password: "$2a$08$dxKDMZrgCSSJuiKW2gxZoeas6AjmWi5oV1GM4pXis9z8p54p4/Xiq",
        permissions: "*"
      }
    ];
    let defaultConfig = { admin: { users: defaultUsers } };
    config = require(env.CONFIG_PATH)[env.NODE_ENV] || defaultConfig;
    
  } catch (e) {
    console.log("No project config file found");
  }
  return config;
}

function getDefaultSettings(process) {
  let variables = process.env || {};
  let defaultSettings = {
    storageModule: require("node-red-viseo-storage-plugin"),
    credentialSecret: variables.CREDENTIAL_SECRET,
    httpNodeMiddleware: require(variables.NODE_RED_HTTP_MIDDLEWARE || "node-red-viseo-middleware")(),
    projectsDir: path.join(variables.FRAMEWORK_ROOT, "../projects"),
    settingsDir: variables.ROOT_DIR
  };

  defaultSettings.userDir = handleBotDir(process);
  defaultSettings.credentialsFile = handleSplitCredFiles(variables);

  return defaultSettings;
}

function handleBotDir(process) {
  if (fs.existsSync(process.env.BOT_ROOT)) {
    process.chdir(process.env.BOT_ROOT);
    return path.normalize(process.env.BOT_ROOT + "/data/");
  } else {
    return path.normalize(process.env.ROOT_DIR + "/data/");
  }
}

function handleSplitCredFiles(variables) {
  let splitCredentialFiles = (variables.CREDENTIAL_SPLIT_FILES || "true") === "true";
  let enableProjects = (variables.ENABLE_PROJECTS || "true") === "true";
  if (enableProjects && splitCredentialFiles) {
    let credsFilePath =  "flows_cred_" + variables.NODE_ENV + ".json";
    return credsFilePath;
  }
  return;
}

function getNodeRedSettings(env, config)  {
   
  let paletteCategories = [
      "subflows",
      "📻_channels",
      "⚙️_bot_factory",
      "🛠️_tools",
      "common",
      "function",
      "network",
      "💬_language",
      "🖐️_channels_helpers",
      "💾_data",
      "📊_logs",
      "🖼️_image",
      "🔉_audio",
      "🃏_miscellaneous"
  ];

  let uiPort = env.PORT || 1880;
  let httpAdminRoot = env.NODE_RED_ROUTE || "/";
  let httpStatic = path.normalize(env.BOT_ROOT + "/webapp");
  let users = config.admin.users || [];
  let disableEditor = (env.NODE_RED_DISABLE_EDITOR || false) === "true";
  let functionGlobalContext = {
      tzModule: require("moment-timezone"),
      xpathModule: require("xpath"),
      domModule: require("xmldom").DOMParser,
      uuidv1: require("uuid/v1"),
      uuidv4: require("uuid/v4"),
      uuidv5: require("uuid/v5"),
      CONFIG: require("node-red-viseo-helper").CONFIG
  }
  let logLevel = env.NODE_ENV === "dev" ? "debug" : "info";


  let settings = {

      uiPort: uiPort,

      //uiHost: "127.0.0.1",
  
      mqttReconnectTime: 15000,
  
      serialReconnectTime: 15000,
  
      //socketReconnectTime: 10000,
  
      //socketTimeout: 120000,

      //tcpMsgQueueSize: 2000,
  
      //httpRequestTimeout: 120000,

      debugMaxLength: 1000,
  
      //nodeMessageBufferMaxLength: 0,
  
      //tlsConfigDisableLocalFiles: true,
  
      debugUseColors: true,
  
      flowFile: "flows.json",
  
      flowFilePretty: true,
  
      //credentialSecret: "a-secret-key",
  
      //userDir: '/home/nol/.node-red/',
  
      //nodesDir: '/home/nol/.node-red/nodes',

      httpAdminRoot: httpAdminRoot,
  
      //httpNodeRoot: '/red-nodes',
  
      //httpRoot: '/red',
  
      httpStatic: httpStatic,
  
      //apiMaxLength: '5mb',
  
      //ui: { path: "ui" },
  
      adminAuth: {
          type: "credentials",
          users: users
      },
  
      //httpNodeAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},

      //httpStaticAuth: {user:"user",pass:"$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN."},
  
      //https: {
      //    key: fs.readFileSync('privatekey.pem'),
      //    cert: fs.readFileSync('certificate.pem')
      //},
  
      //requireHttps: true
  
      disableEditor: disableEditor,
  
      //httpNodeCors: {
      //    origin: "*",
      //    methods: "GET,PUT,POST,DELETE"
      //},

      //httpNodeMiddleware: function(req,res,next) {
      //    // Handle/reject the request, or pass it on to the http in node by calling next();
      //    // Optionally skip our rawBodyParser by setting this to true;
      //    //req.skipRawBodyParser = true;
      //    next();
      //},

      //webSocketNodeVerifyClient: function(info) {
      //    // 'info' has three properties:
      //    //   - origin : the value in the Origin header
      //    //   - req : the HTTP request
      //    //   - secure : true if req.connection.authorized or req.connection.encrypted is set
      //    //
      //    // The function should return true if the connection should be accepted, false otherwise.
      //    //
      //    // Alternatively, if this function is defined to accept a second argument, callback,
      //    // it can be used to verify the client asynchronously.
      //    // The callback takes three arguments:
      //    //   - result : boolean, whether to accept the connection or not
      //    //   - code : if result is false, the HTTP error status to return
      //    //   - reason: if result is false, the HTTP reason string to return
      //},
  
      functionGlobalContext: functionGlobalContext,
  
      exportGlobalContextKeys: false,
  
      //contextStorage: {
      //    default: {
      //        module:"localfilesystem"
      //    },
      //},
  
      paletteCategories: paletteCategories,
  
      logging: {
          console: {
              level: logLevel,
              metrics: false,
              audit: false
          }
      }
  }

  return settings;
}

function getEditorTheme(env) {
  let packageJson = require("../package.json");
  let enableProjects = (env.ENABLE_PROJECTS || "true") === "true";
  let catalog = `https://catalog.bot.viseo.io/${packageJson.version}.json`;

  let _env = 'dev';
  if (env.NODE_ENV == "prod") _env = 'prod';
  if (env.NODE_ENV == "qual" || env.NODE_ENV == "quali") _env = 'quali';

  let title = "";
  if (env.BOT) title = "<b>" + _env.toUpperCase() + "</b> | " + env.BOT.replace(/[-_\.]/g, " ");
 

  let editor = {
        palette: {
            catalogues: [
                catalog
            ]
        },
        projects: {
            enabled: enableProjects, // To enable the Projects feature, set this value to true
            createDefaultFromZip: "https://github.com/NGRP/viseo-bot-template/archive/v1.0.0.zip",
            packageDir: "data/",
            activeProject: env.BOT
        },
        page: {
            title: "VBM - " + (env.BOT ? env.BOT.replace(/[-_\.]/g, " ") : "welcome !"),
            favicon: path.normalize(`${env.FRAMEWORK_ROOT}/theme/favicon.ico`),
            css: path.normalize(`${env.FRAMEWORK_ROOT}/theme/viseo_${_env}.css`),
            scripts: path.normalize(`${env.FRAMEWORK_ROOT}/theme/viseo.js`)
        },
        header: {
            title: title || "welcome !",
            image: path.normalize(`${env.FRAMEWORK_ROOT}/theme/logo_${_env}.png`),
            url: "https://bot.viseo.io"
        },
        deployButton: {
            type: "simple",
            label: "Save"
        },
        menu: {
            "menu-item-import-library": false,
            "menu-item-export-library": false,
            "menu-item-keyboard-shortcuts": false,
            "menu-item-help": {
              label: env.BOT ? env.BOT.replace(/[-_\.]/g, " ") : "welcome !", url: "https://bot.viseo.io"
            }
        },
        userMenu: true,
        login: {
            image: path.normalize(`${env.FRAMEWORK_ROOT}/theme/viseo_login.png`)
        }
  }

  return editor;
}

function getFinalSettings(env, defaultSettings) {
  try {
    if (fs.existsSync(env.NODE_RED_CONFIG_PATH)) {
      const botSettings = require(env.NODE_RED_CONFIG_PATH);

      if (botSettings) {
        return finalSettings = dextend(defaultSettings, botSettings);
      }
    }
    else {
      console.log("Info: No override of Node-RED config found.");
    }
  } catch (e) {
    console.log(e);
  }
  return defaultSettings;
}