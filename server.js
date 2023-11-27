import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

console.log("start");

const router = new Router();

router.get("/api/TList", (context) => {
    console.log("/api/TList");
    // context.response.body = "kameyamatakahito";
    const db = new DB("todo.db");
    context.response.body = db.query("SELECT * FROM TList");
    db.close();
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