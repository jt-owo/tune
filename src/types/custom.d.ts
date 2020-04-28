export {};

declare global {
    namespace NodeJS {
        interface Global {
            settings: {
                path: string;
            };
        }
    }
}
