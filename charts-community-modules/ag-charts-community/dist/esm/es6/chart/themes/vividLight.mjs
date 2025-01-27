import { ChartTheme } from './chartTheme.mjs';
const palette = {
    fills: ['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921', '#fa3081'],
    strokes: ['#4086a4', '#b1a235', '#6c8a2b', '#a03e24', '#af5517', '#af225a'],
};
export class VividLight extends ChartTheme {
    getPalette() {
        return palette;
    }
}
