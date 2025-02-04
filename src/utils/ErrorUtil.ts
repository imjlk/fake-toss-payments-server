import fs from "fs";
import serializeError from "serialize-error";
import { Singleton } from "tstl/thread/Singleton";
import { randint } from "tstl/algorithm/random";

import { TossFakeConfiguration } from "../FakeTossConfiguration";

export namespace ErrorUtil {
    export function toJSON(err: any): object {
        return err instanceof Object && err.toJSON instanceof Function
            ? err.toJSON()
            : serializeError(err);
    }

    export async function log(
        prefix: string,
        data: string | object | Error,
    ): Promise<void> {
        try {
            if (data instanceof Error) data = toJSON(data);

            const date: Date = new Date();
            const fileName: string = `${date.getFullYear()}${cipher(
                date.getMonth() + 1,
            )}${cipher(date.getDate())}${cipher(date.getHours())}${cipher(
                date.getMinutes(),
            )}${cipher(date.getSeconds())}.${randint(
                0,
                Number.MAX_SAFE_INTEGER,
            )}`;
            const content: string = JSON.stringify(data, null, 4);

            await directory.get();
            await fs.promises.writeFile(
                `${TossFakeConfiguration.ASSETS}/logs/errors/${prefix}_${fileName}.log`,
                content,
                "utf8",
            );
        } catch { }
    }
}

function cipher(val: number): string {
    if (val < 10) return "0" + val;
    else return String(val);
}

const directory = new Singleton(async () => {
    try {
        await fs.promises.mkdir(`${TossFakeConfiguration.ASSETS}/logs`);
    } catch { }

    try {
        await fs.promises.mkdir(`${TossFakeConfiguration.ASSETS}/logs/errors`);
    } catch { }
});
