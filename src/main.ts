import { IUserModule } from "./user";

export const hello = (usermodule: IUserModule) => usermodule.getName().then((name) => (
    {
        content: `<!DOCTYPE html>
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
        <p>Hi everybody from ${name}!</p>
    </body>
</html>`,
        contentType: "text/html",
        status: 200,
    }));
