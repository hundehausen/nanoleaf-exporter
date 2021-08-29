require("dotenv").config();
const express = require("express");
const prometheus = require("prom-client");
const axios = require("axios").default;

const PORT = process.env.PORT || 9878;
const AUTH_TOKEN = process.env.AUTH_TOKEN || "";
const IP_ADDRESS = process.env.IP_ADDRESS || "192.168.xx.xx";
const Gauge = prometheus.Gauge;

const app = express();

const instance = axios.create({
  baseURL: `http://${IP_ADDRESS}/api/v1/${AUTH_TOKEN}`,
  timeout: 1000,
});

const on_gauge = new Gauge({
  name: "nanoleaf_on",
  help: "Boolean of whether nanoleaf is on or off.",
});
const brightness_gauge = new Gauge({
  name: "nanoleaf_brightness",
  help: "Number of brightness.",
});
const firmwareUpgrade_gauge = new Gauge({
  name: "nanoleaf_firmware_upgrade",
  help: "Boolean of whether nanoleaf has an upgrade available or not.",
});

async function getMetrics() {
  const res = (await instance.get(`/`)).data;
  const on = res.state.on.value ? 1 : 0;
  const brightness = res.state.brightness.value;
  const firmwareUpgradeAvailable = res.state.firmwareUpgrade ? 1 : 0;
  return { on, brightness, firmwareUpgradeAvailable };
}

async function main() {
  app.get("/metrics", (req, res) => {
    getMetrics()
      .then(async ({ on, brightness, firmwareUpgradeAvailable }) => {
        on_gauge.set(Number(on));
        brightness_gauge.set(Number(brightness));
        firmwareUpgrade_gauge.set(Number(firmwareUpgradeAvailable));

        const registredMetrics = await prometheus.register.metrics();
        res.end(registredMetrics);
      })
      .catch((e) => {
        console.log(e);
      });
  });
}
main();

module.exports = app;
app.listen(PORT, () =>
  console.log(`hundehausen/nanoleaf-exporter serving on :${PORT}`)
);
