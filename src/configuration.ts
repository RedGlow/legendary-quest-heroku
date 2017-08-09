import * as defaultConfiguration from "./configuration.default.json";

const conf: IConfiguration = Object.assign({}, (defaultConfiguration as any) as IConfiguration);

export interface IConfiguration {
    remoteServices: {
        gw2ShiniesUrl: string;
        gw2ProfitsUrl: string;
        gw2EfficiencyUrl: string;
        apiUrl: string;
    };
}

export default function get(): IConfiguration {
    return conf;
}
