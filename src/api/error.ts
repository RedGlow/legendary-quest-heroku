interface IErrorBody {
    shortcode: string;
    message: string;
}

export class APIError extends Error {

    public body: IErrorBody;

    constructor(
        public statusCode: number,
        shortcode: string,
        description: string) {
        super(description);
        this.body = {
            message: description,
            shortcode,
        };
        Object.setPrototypeOf(this, APIError.prototype);
    }
}
