import * as rerrors from "restify-errors";

interface IErrorBody {
    shortcode: string;
    message: string;
}

export class APIError extends rerrors.RestError {

    public body: IErrorBody;

    constructor(
        public statusCode: number,
        private shortcode: string,
        private description: string) {
        super({
            statusCode,
        });
        Object.setPrototypeOf(this, APIError.prototype);
    }

    public toJSON() {
        return {
            message: this.description,
            shortcode: this.shortcode,
        };
    }
}
