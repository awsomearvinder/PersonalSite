import { walk } from "https://deno.land/std@0.76.0/fs/walk.ts";
import { Router, Application } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import * as eta from "https://deno.land/x/eta@v1.11.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v1.0.1/mod.ts";
import * as util from "./util.ts";

/**
 * This function modifies the ``router`` variable
 * It will add every template to ``router`` that exists
 * in the directory provided in templateDirPath.
 */
async function generateStaticTemplateUrlRoutes(
  router: Router,
  templateDirPath: string
) {
  //For each template file, generate and register the template
  //with the router.
  for await (const file of walk(templateDirPath)) {
    if (file.isDirectory) {
      continue;
    }

    let trimmedPath = util.removeFromBack(".eta", file.path);
    //We don't want to serve any files that aren't templates. ***bad*** news.
    if (trimmedPath instanceof util.NotAtBack) {
      console.error("Found a file that is not an .eta template. Skipping.");
      console.error(`   File name: ${file.name}`);
      continue;
    }
    trimmedPath = util.removeFromFront(templateDirPath, trimmedPath);
    //Crash and burn if bugs exist! :)
    if (trimmedPath instanceof util.NotAtFront) {
      throw new util.Unreachable();
    }

    const renderedTemplate = await eta.renderFile(
      file.path,
      eta.defaultConfig,
      undefined
    );
    //The reason why I have to cast this to a string is a mystery to me.
    router.get(trimmedPath as string, async (req, _) => {
      req.response.body = renderedTemplate;
    });
  }
}

export async function main() {
  //Setup application and the router in charge of routing.
  const app = new Application();
  const router = new Router();
  const conf = config({ safe: true });
  router.get("/", async (req, _) => {
    req.response.body = "test";
  });

  const DENO_PATH = util.normalizePath(conf["staticTemplateDirPath"]);
  generateStaticTemplateUrlRoutes(router, DENO_PATH);

  //Logging here.
  app.use(async (ctx, next) => {
    console.log(`Got a request from: [${ctx.request.ip}]\
                At URL: [${ctx.request.url}]\
                with method: ${ctx.request.method}\
  `);
    await next();
    console.log(`responded with ${ctx.response.body?.toString()}`);
  });
  //Add in routes.
  app.use(router.routes());

  await app.listen({ port: 8000 });
}

await main();
