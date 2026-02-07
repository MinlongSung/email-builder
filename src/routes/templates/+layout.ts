
import { exampleTemplate } from '$lib/template/data/exampleTemplate';

export async function load() {
    const templatePromise = Promise.resolve(exampleTemplate);

    return {
        templatePromise
    };
};