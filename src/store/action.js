export const CHANGE = 'CHANGE';

export const change = (object) => {
    return {
        type: CHANGE,
        object
    }
}