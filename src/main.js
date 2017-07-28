module.exports = {
    hello: usermodule => usermodule.getName().then(name => (
        {
            status: 200,
            contentType: 'text/html',
            content: `<!DOCTYPE html><html><head><title>Title</title></head><body><p>Hi everybody from ${name}!</p></body></html>`
        }))
};