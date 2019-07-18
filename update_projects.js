const { resolve, join } = require('path');
const { readdirSync, lstatSync, existsSync, writeFile } = require('fs');
const { exec } = require('child_process');

// Get arguments
let args = {};
let argIgnored = false;
for (let i=2; i<process.argv.length-1; i+=2) {
    switch(process.argv[i]) {
        case '-packagePath':
            args['mainPackageJsonPath'] = process.argv[i+1]
            continue;
        case '-projectsDir':
            args['projectsPath'] = process.argv[i+1];
            continue;
        case '-projectPackagePath':
            args['projectPackagePath'] = process.argv[i+1];
            continue;
    }
    console.error("[IGNORED ARGUMENT] Unexpected argument "+ process.argv[i] + ".");
    argIgnored = true;
}

if (argIgnored) {
    console.error("Use: node ./update_projects.js [-packagePath packagePathValue] [-projectsDir projectsDirValue] [-projectPackagePath projectPackagePathValue] \n",
    "-packagePath: path for the framework's 'package.json' file (default: ./package.json)\n",
    "-projectsDir: path for the folder that contains projects (default: ../projects/)\n",
    "-projectPackagePath: relative path for projects package.json files (default: data/package.json)");
    process.exit(1);
}

// Get package.json content
let mainPackageJsonPath =  args['mainPackageJsonPath'] || join(__dirname, 'package.json');
let mainPackageJson = require(mainPackageJsonPath);

// Get project directories
let mainPath = resolve(__dirname, '..');
let projectsPath = args['projectsPath'] || join(mainPath, 'projects');

let directories = readdirSync(projectsPath)
    .filter(name => (name[0] !== '.'))
    .map(name => join(projectsPath, name))
    .filter(source => lstatSync(source).isDirectory())

// Update each package.json file
for (let project of directories) {

    // Verify file exists
    let packagePath = (args['projectPackagePath']) ? join(project, args['projectPackagePath']) : join(project, 'data', 'package.json');
    
    // exists ???
    if (!existsSync(packagePath)) continue;
    let packageJson = require(packagePath);
    if (!packageJson || !packageJson.dependencies) continue;

    // Open and update file
    console.log('['+ project +']', 'Opening project...') 
    let change = false;
    for (let dependency in packageJson.dependencies) {
        if (mainPackageJson["node-red-catalog"][dependency] !== packageJson.dependencies[dependency] &&
            packageJson.dependencies[dependency].slice(0,5) !== "file:") {
            packageJson.dependencies[dependency] = mainPackageJson["node-red-catalog"][dependency];
            change = true;
        }
    }
    packageJson["framework-version"] = mainPackageJson["version"];

    // Write file
    writeFile(packagePath, JSON.stringify(packageJson, null, 2), function (err) {
        if (err) console.error('['+ project +']', err);
    });

    // Update npm packages
    if (!change) {
        console.log('['+ project +']', 'Nothing to update.') 
        continue;
    }

    console.log('['+ project +']', 'Updating...') 
    exec("cd " + join(project, 'data') + "&& npm update", function(error, stdout, stderr) { 
        if (error) {
            console.error(stderr)
            console.log('['+ project +']', 'An error occured.')
        }
        else {
            console.log(stdout)
            console.log('['+ project +']', 'Done!')
        }
    });

    process.exit(0);
}