// @ts-ignore
import { writeFileSync } from "node:fs";

const allPipedInstancesUrl = "https://raw.githubusercontent.com/wiki/TeamPiped/Piped/Instances.md";
const hyperpipeInstancesUrl = "https://raw.githubusercontent.com/n-ce/Uma/main/hyperpipe.json";
const unified_instances = {
  /* 'https://pipedapi.drgns.space'
    : 'https://invidious.drgns.space', */

  "https://pipedapi.in.projectsegfau.lt": "https://inv.in.projectsegfault",

  "https://pipedapi.reallyaweso.me": "https://invidious.reallyaweso.me",

  /*  'https://api.piped.private.coffee'
    : 'https://invidious.private.coffee',*/

  "https://api.piped.privacydev.net": "https://invidious.privacydev.net",

  "https://pipedapi.adminforge.de": "https://invidious.adminforge.de",

  /* 'https://pipedapi.us.projectsegfau.lt'
    : 'https://inv.us.projectsegfault', */

  "https://api.piped.projectsegfau.lt": "https://invidious.projectsegfault",

  /*  'https://piped-api.lunar.icu'
    : 'https://invidious.lunar.icu', */

  /*  'https://piapi.ggtyler.dev'
    : 'https://iv.ggtyler.dev', */

  /*  'https://pipedapi.darkness.services'
    : 'https://invidious.darkness.services' */
};

async function getSuggestions(i: string) {
  const t = performance.now();
  let array = [0, ""];

  await fetch(i + "/opensearch/suggestions?query=the")
    .then((res) => res.json())
    .then((data) => {
      const score = 1 / (performance.now() - t);
      if (data.length) array = [score, i];
      else throw new Error();
    })
    .catch(() => [0, ""]);

  return array;
}

fetch(allPipedInstancesUrl)
  .then((res) => res.text())
  .then((text) => text.split("--- | --- | --- | --- | ---")[1])
  .then((table) => table.split("\n"))
  .then((instances) => instances.map((instance) => instance.split(" | ")[1]))
  .then(async (instances) => {
    instances.shift();

    const dynamic_instances: {
      piped: string[];
      invidious: string[];
      hyperpipe: string[];
      unified: number;
    } = {
      piped: [],
      invidious: [
        "https://invi.susurrando.com",
        "https://invidious.catspeed.cc",
        "https://invidious.schenkel.eti.br"  
      ],
      hyperpipe: [],
      unified: 0,
    };

    const hyperpipeList = await fetch(hyperpipeInstancesUrl).then((res) => res.json());

    await Promise.all(instances.map(getSuggestions)).then((array) =>
      array
        .sort((a, b) => <number>b[0] - <number>a[0])
        .filter((i) => i[0])
        .forEach((i) => {
          if (i[1] in unified_instances) {
            dynamic_instances.unified++;
            dynamic_instances.piped.unshift(i[1] as string);
            dynamic_instances.invidious.unshift(unified_instances[i[1]]);

            if (i[1] in hyperpipeList)
              dynamic_instances.hyperpipe.unshift(
                hyperpipeList[i[1]] as string
              );
          }
          else dynamic_instances.piped.push(i[1] as string);
        })
    );

    fetch("https://api.invidious.io/instances.json")
      .then((res) => res.json())
      .then(
        (
          json: [
            string,
            {
              api: boolean;
              uri: string;
            }
          ][]
        ) =>
          json
            .filter(
              (v) => v[1].api && !dynamic_instances.invidious.includes(v[1].uri)
            )
            .filter(
              (v) => !["invidious.nerdvpn.de", "inv.nadeko.net"].includes(v[0])
            ) // causing 403 issues
            .forEach((v) => dynamic_instances.invidious.push(v[1].uri))
      )
      .then(() => {
        console.log(dynamic_instances);
        writeFileSync(
          "dynamic_instances.json",
          JSON.stringify(dynamic_instances, null, 4)
        );
      });
  });
