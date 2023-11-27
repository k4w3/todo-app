import { Application, Router } from "https://deno.land/x/oak/mod.ts";

console.log("start");

const router = new Router();

router.get("/get1", (context) => {
    console.log("/get1");
    context.response.body = "kameyamatakahito";
});




// const app = new Application();

// app.use((ctx) => {
//   ctx.response.body = "Hello World!";
// });

// await app.listen({ port: 8000 });


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/www`,
      index: "index.html",
    });
  } catch {
    await next();
  }
});

await app.listen({ port: 8000 });