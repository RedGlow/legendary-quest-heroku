import * as React from "react";
import data from "./data";

export interface IHelloProps { compiler: string; framework: string; }

export const Hello = (props: IHelloProps) => <h1>Hello from {data.compiler} and {data.framework}!</h1>;
