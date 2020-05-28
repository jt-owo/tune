export {};

declare global {
    namespace NodeJS {
        interface Global {
            settings: {
                dummy: any;
            };
        }
    }
}
