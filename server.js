import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { getQuery } from "https://deno.land/x/oak/helpers.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

console.log("start");

const router = new Router();

router.get("/api/TList", (context) => {
    console.log("GET /api/TList");
    // context.response.body = "kameyamatakahito";
    const db = new DB("todo.db");
    // let res = db.query("SELECT * FROM TList");
    let res = db.queryEntries("SELECT id, name, done FROM TList");

    db.close();
    context.response.body = res;
});

router.post("/api/TList", async (context) => {
    console.log("POST /api/TList");
    const params = await context.request.body({type:"form"}).value;

    const db = new DB("todo.db");
    db.query("INSERT INTO TList (name, done) VALUES (?,?)",
    [params.get("name"), params.get("done")]);
    db.close();
    context.response.body = "OK";
});

router.put("/api/TList/:id", async (context) => {
    console.log("put /api/TList");
    const queryParams = getQuery(context, { mergeParams: true });
    const postParams = await context.request.body({type:"form"}).value;
    console.log(queryParams);
    console.log(postParams);

    const db = new DB("todo.db");
    db.query("UPDATE TList SET name=?, done=? WHERE id=?",
    [postParams.get("name"), postParams.get("done"), queryParams.id]);
    db.close();
    context.response.body = "OK";
});

router.delete("/api/TList/:id", async (context) => {
    console.log("delete /api/TList");
    const queryParams = getQuery(context, { mergeParams: true });
    console.log(queryParams);

    const db = new DB("todo.db");
    db.query("DELETE FROM TList WHERE id=?",
    [queryParams.id]);
    db.close();
    context.response.body = "OK";
});

// router.get("/api/TList1/:id", async (context) => {
//     console.log("get1 /api/TList");
//     const params = getQuery(context, { mergeParams: true });
//     console.log(params);
//     // console.log(context.params);
//     // const params = await context.request.body({type:"form"}).value;

//     // const db = new DB("todo.db");
//     // db.query("INSERT INTO TList (name, done) VALUES (?,?)",
//     // [params.get("name"), params.get("done")]);
//     // db.close();
//     context.response.body = "OK";
// });
// router.put("/api/TList", async (context) => {
//     console.log("PUT /api/TList");
//     console.log(context.params);
//     // const params = await context.request.body({type:"form"}).value;

//     // const db = new DB("todo.db");
//     // db.query("INSERT INTO TList (name, done) VALUES (?,?)",
//     // [params.get("name"), params.get("done")]);
//     // db.close();
//     context.response.body = "OK";
// });




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