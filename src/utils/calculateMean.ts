export function calculateMean(array: number[]): number {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    const mean = sum / array.length;
    return mean;
}