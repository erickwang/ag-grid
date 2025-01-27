var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { _, Autowired, Component, PostConstruct, RefSelector } from "@ag-grid-community/core";
import { getMaxValue } from "../formatPanel.mjs";
export class MarkersPanel extends Component {
    constructor(chartOptionsService, getSelectedSeries) {
        super();
        this.chartOptionsService = chartOptionsService;
        this.getSelectedSeries = getSelectedSeries;
    }
    init() {
        const groupParams = {
            cssIdentifier: 'charts-format-sub-level',
            direction: 'vertical'
        };
        this.setTemplate(MarkersPanel.TEMPLATE, { seriesMarkersGroup: groupParams });
        this.initMarkers();
    }
    initMarkers() {
        const seriesMarkerShapeOptions = [
            {
                value: 'square',
                text: 'Square'
            },
            {
                value: 'circle',
                text: 'Circle'
            },
            {
                value: 'cross',
                text: 'Cross'
            },
            {
                value: 'diamond',
                text: 'Diamond'
            },
            {
                value: 'plus',
                text: 'Plus'
            },
            {
                value: 'triangle',
                text: 'Triangle'
            },
            {
                value: 'heart',
                text: 'Heart'
            }
        ];
        this.seriesMarkerShapeSelect
            .addOptions(seriesMarkerShapeOptions)
            .setLabel(this.chartTranslationService.translate('shape'))
            .setValue(this.getSeriesOption("marker.shape"))
            .onValueChange(value => this.setSeriesOption("marker.shape", value));
        // scatter charts should always show markers
        const chartType = this.chartOptionsService.getChartType();
        const shouldHideEnabledCheckbox = _.includes(['scatter', 'bubble'], chartType);
        this.seriesMarkersGroup
            .setTitle(this.chartTranslationService.translate("markers"))
            .hideEnabledCheckbox(shouldHideEnabledCheckbox)
            .setEnabled(this.getSeriesOption("marker.enabled") || false)
            .hideOpenCloseIcons(true)
            .onEnableChange(newValue => this.setSeriesOption("marker.enabled", newValue));
        const initInput = (expression, input, labelKey, defaultMaxValue) => {
            const currentValue = this.getSeriesOption(expression);
            input.setLabel(this.chartTranslationService.translate(labelKey))
                .setMaxValue(getMaxValue(currentValue, defaultMaxValue))
                .setValue(`${currentValue}`)
                .setTextFieldWidth(45)
                .onValueChange(newValue => this.setSeriesOption(expression, newValue));
        };
        if (chartType === 'bubble') {
            initInput("marker.maxSize", this.seriesMarkerMinSizeSlider, "maxSize", 60);
            initInput("marker.size", this.seriesMarkerSizeSlider, "minSize", 60);
        }
        else {
            this.seriesMarkerMinSizeSlider.setDisplayed(false);
            initInput("marker.size", this.seriesMarkerSizeSlider, "size", 60);
        }
        initInput("marker.strokeWidth", this.seriesMarkerStrokeWidthSlider, "strokeWidth", 10);
    }
    getSeriesOption(expression) {
        return this.chartOptionsService.getSeriesOption(expression, this.getSelectedSeries());
    }
    setSeriesOption(expression, newValue) {
        this.chartOptionsService.setSeriesOption(expression, newValue, this.getSelectedSeries());
    }
}
MarkersPanel.TEMPLATE = `<div>
            <ag-group-component ref="seriesMarkersGroup">
                <ag-select ref="seriesMarkerShapeSelect"></ag-select>
                <ag-slider ref="seriesMarkerMinSizeSlider"></ag-slider>
                <ag-slider ref="seriesMarkerSizeSlider"></ag-slider>
                <ag-slider ref="seriesMarkerStrokeWidthSlider"></ag-slider>
            </ag-group-component>
        </div>`;
__decorate([
    RefSelector('seriesMarkersGroup')
], MarkersPanel.prototype, "seriesMarkersGroup", void 0);
__decorate([
    RefSelector('seriesMarkerShapeSelect')
], MarkersPanel.prototype, "seriesMarkerShapeSelect", void 0);
__decorate([
    RefSelector('seriesMarkerSizeSlider')
], MarkersPanel.prototype, "seriesMarkerSizeSlider", void 0);
__decorate([
    RefSelector('seriesMarkerMinSizeSlider')
], MarkersPanel.prototype, "seriesMarkerMinSizeSlider", void 0);
__decorate([
    RefSelector('seriesMarkerStrokeWidthSlider')
], MarkersPanel.prototype, "seriesMarkerStrokeWidthSlider", void 0);
__decorate([
    Autowired('chartTranslationService')
], MarkersPanel.prototype, "chartTranslationService", void 0);
__decorate([
    PostConstruct
], MarkersPanel.prototype, "init", null);
