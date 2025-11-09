// mounts module routers based on names array
module.exports = function loadModules(app, names = []) {
for (const name of names) {
try {
const router = require(`../modules/${name}/${name}.routes`);
app.use(`/api/${name}`, router);
console.log(`Mounted module: ${name}`);
} catch (err) {
console.warn(`Failed to load module ${name}:`, err.message);
}
}
}