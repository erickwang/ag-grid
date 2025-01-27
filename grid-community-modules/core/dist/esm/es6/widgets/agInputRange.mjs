import { AgAbstractInputField } from "./agAbstractInputField.mjs";
export class AgInputRange extends AgAbstractInputField {
    constructor(config) {
        super(config, 'ag-range-field', 'range');
    }
    postConstruct() {
        super.postConstruct();
        const { min, max, step } = this.config;
        if (min != null) {
            this.setMinValue(min);
        }
        if (max != null) {
            this.setMaxValue(max);
        }
        this.setStep(step || 1);
    }
    addInputListeners() {
        this.addManagedListener(this.eInput, 'input', (e) => {
            const value = e.target.value;
            this.setValue(value);
        });
    }
    setMinValue(value) {
        this.min = value;
        this.eInput.setAttribute('min', value.toString());
        return this;
    }
    setMaxValue(value) {
        this.max = value;
        this.eInput.setAttribute('max', value.toString());
        return this;
    }
    setStep(value) {
        this.eInput.setAttribute('step', value.toString());
        return this;
    }
    setValue(value, silent) {
        if (this.min != null) {
            value = Math.max(parseFloat(value), this.min).toString();
        }
        if (this.max != null) {
            value = Math.min(parseFloat(value), this.max).toString();
        }
        const ret = super.setValue(value, silent);
        this.eInput.value = value;
        return ret;
    }
}
