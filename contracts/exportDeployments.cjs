#!/env/bin/node

const fs = require('fs');
const path = require('path');

const deploymentsDir = path.join(__dirname, '.', 'deployments');
const outputFilePath = process.argv[2];

const networks = fs.readdirSync(deploymentsDir);

const exportCmd = 'npx forge-deploy export';
const tmpExportsDir = path.join(__dirname, '.', 'cache', 'tmp-exports');

let output = 'export const deployments = {\n';
for (const network of networks) {
    const exportCmdWithArgs = `${exportCmd} ${network} ${path.join(tmpExportsDir, network)}.json`;
    console.log(exportCmdWithArgs);
    const { stdout } = require('child_process').execSync(exportCmdWithArgs);
    const networkInfo = JSON.parse(fs.readFileSync(path.join(tmpExportsDir, network) + '.json'));
    const chainId = Number(networkInfo.chainId);
    output += `\n  ${chainId}: ${JSON.stringify(networkInfo, 2, null)},`
}
output = `${output.slice(0, -1)}\n} as const;`;

fs.writeFileSync(outputFilePath, output);

console.log(`Wrote deployments to ${outputFilePath}`);
