export function exceptionHandle(target: any, key: string, desc: any) {
    let originalMethod = desc.value;
    desc.value = function (...args: any[]) {
        try {
            return originalMethod.apply(this, args);
        } catch (error) {
            console.log(error);
            return null;
        }
    };
    return desc;
}
