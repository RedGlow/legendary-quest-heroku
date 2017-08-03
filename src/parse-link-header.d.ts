declare module "parse-link-header" {
    function ParseLinkHeader(header: string): { [name: string]: IHeaderPart };
    namespace ParseLinkHeader { }
    export = ParseLinkHeader;
}

interface IHeaderPart {
    rel: string;
    url: string;
}
