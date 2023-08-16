import '@elastic/eui/dist/eui_theme_light.css';
import React from 'react';
import { EuiSuperDatePicker } from '@elastic/eui';

class DateComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: 'now-15m',
            end: 'now',
            isPaused: true,
            refreshInterval: 0
        };
        // Bind methods to the instance
        this.onTimeChange = this.onTimeChange.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);

    }

    onTimeChange({ start, end }) {
        this.setState({ start, end });
    }
    handleRefresh({ start, end, refreshInterval }) {
        console.log('Refresh button clicked!', start, end, refreshInterval);
        this.props.updateTable(start, end);
    }

    render() {
        return (
            <div>
                <EuiSuperDatePicker
                    start={this.state.start}
                    end={this.state.end}
                    isPaused={this.state.isPaused}
                    refreshInterval={this.state.refreshInterval}
                    onTimeChange={this.onTimeChange}
                    onRefresh={this.handleRefresh}  // Added onRefresh prop
                />
            </div>
        );
    }

}

export default DateComponent;
