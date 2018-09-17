import React, {Component} from 'react'
import PropTypes, { arrayOf } from 'prop-types'
import rome from 'rome'
import moment from 'moment'

import timeRangeDefaults from 'shared/data/timeRangeShortcuts'
const dateFormat = 'YYYY-MM-DD HH:mm'

function defaultTimeRangeShortcut(shortcut) {
    let lower
    const upper = moment()

    switch (shortcut) {
        case 'pastWeek': {
            lower = moment().subtract(1, 'week')
            break
        }
        case 'pastMonth': {
            lower = moment().subtract(1, 'month')
            break
        }
        case 'pastYear': {
            lower = moment().subtract(1, 'year')
            break
        }
        case 'thisWeek': {
            lower = moment().startOf('week')
            break
        }
        case 'thisMonth': {
            lower = moment().startOf('month')
            break
        }
        case 'thisYear': {
            lower = moment().startOf('year')
            break
        }
    }

    return {
        lower,
        upper,
    }
}

class CustomTimeRange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isNow: this.props.timeRange[this.props.now] === 'now()',
        }
    }

    componentDidMount() {
        const {timeRange} = this.props

        const lower = rome(this.lower, {
            dateValidator: rome.val.beforeEq(this.upper),
            appendTo: this.lowerContainer,
            initialValue: this.getInitialDate(timeRange.lower),
            autoClose: false,
            autoHideOnBlur: false,
            autoHideOnClick: false,
        })

        const upper = rome(this.upper, {
            dateValidator: rome.val.afterEq(this.lower),
            appendTo: this.upperContainer,
            autoClose: false,
            initialValue: this.getInitialDate(timeRange.upper),
            autoHideOnBlur: false,
            autoHideOnClick: false,
        })

        this.lowerCal = lower
        this.upperCal = upper

        this.lowerCal.show()
        this.upperCal.show()
    }

    getInitialDate = time => {
        const {upper, lower} = this.props.timeRange

        if (upper || lower) {
            return this._formatTimeRange(time)
        }

        return moment(new Date()).format(dateFormat)
    }

    handleRefreshCals = () => {
        this.lowerCal.refresh()
        this.upperCal.refresh()
    }

    handleToggleNow = () => {
        this.setState({isNow: !this.state.isNow})
    }

    handleNowOff = () => {
        this.setState({isNow: false})
    }

    /*
     * Upper and lower time ranges are passed in with single quotes as part of
     * the string literal, i.e. "'2015-09-23T18:00:00.000Z'".  Remove them
     * before passing the string to be parsed.
     */
    _formatTimeRange = timeRange => {
        if (!timeRange) {
            return ''
        }

        if (timeRange === 'now()') {
            return moment(new Date()).format(dateFormat)
        }

        // If the given time range is relative, create a fixed timestamp based on its value
        if (timeRange.match(/^now/)) {
            const [, duration, unitOfTime] = timeRange.match(/(\d+)(\w+)/)
            moment().subtract(duration, unitOfTime)
        }

        return moment(timeRange.replace(/\'/g, '')).format(dateFormat)
    }

    handleClick = () => {
        const {onApplyTimeRange, onClose} = this.props
        const {isNow} = this.state

        const lower = this.lowerCal.getDate().toISOString()
        const upper = this.upperCal.getDate().toISOString()

        if (isNow) {
            onApplyTimeRange({
                lower,
                upper,
                [this.props.now]: 'now()'
            })
        } else {
            onApplyTimeRange({lower, upper})
        }

        if (onClose) {
            onClose()
        }
    }

    handleTimeRangeShortcut = shortcut => {
        const {handleTimeRangeShortcut} = this.props
        const {lower, upper} = handleTimeRangeShortcut(shortcut)

        return () => {
        
            this.lower.value = lower.format(dateFormat)
            this.upper.value = upper.format(dateFormat)

            this.lowerCal.setValue(lower)
            this.upperCal.setValue(upper)

            this.handleRefreshCals()
        }
    }

    render() {
        const {isNow} = this.state
        const {page, shortcuts, now} = this.props
        const isNowDisplayed = page !== 'DataExplorer'

        const isUpperNow = now === 'upper' && isNow
        const isLowerNow = now === 'lower' && isNow

        return (
            <div className="custom-time--container">
                <div className="custom-time--shortcuts">
                    <div className="custom-time--shortcuts-header">Shortcuts</div>
                    {shortcuts.map(({id, name}) => (
                        <div
                            key={id}
                            className="custom-time--shortcut"
                            onClick={this.handleTimeRangeShortcut(id)}
                            >
                            {name}
                        </div>
                    ))}
                </div>
                <div className="custom-time--wrap">
                    <div className="custom-time--dates" onClick={this.handleRefreshCals}>
                        <div
                            className="custom-time--lower-container"
                            ref={r => (this.lowerContainer = r)}
                            disabled={isLowerNow}
                            >
                            {now === 'lower' && isNowDisplayed ? (
                                <div
                                    className={`btn btn-xs custom-time--now ${
                                        isNow ? 'btn-primary' : 'btn-default'
                                        }`}
                                    onClick={this.handleToggleNow}
                                    >
                                    Now
                                </div>
                            ) : null}
                            <input
                                className="custom-time--lower form-control input-sm"
                                ref={r => (this.lower = r)}
                                placeholder="from"
                                onKeyUp={this.handleRefreshCals}
                                disabled={isLowerNow}
                            />
                            {isLowerNow && isNowDisplayed ? (
                                <div
                                    className="custom-time--mask"
                                    onClick={this.handleNowOff}
                                    />
                            ) : null}
                        </div>
                        <div
                            className="custom-time--upper-container"
                            ref={r => (this.upperContainer = r)}
                            disabled={isUpperNow}
                            >
                            {now === 'upper' && isNowDisplayed ? (
                                <div
                                    className={`btn btn-xs custom-time--now ${
                                        isNow ? 'btn-primary' : 'btn-default'
                                    }`}
                                    onClick={this.handleToggleNow}
                                    >
                                    Now
                                </div>
                            ) : null}
                            <input
                                className="custom-time--upper form-control input-sm"
                                ref={r => (this.upper = r)}
                                placeholder="to"
                                onKeyUp={this.handleRefreshCals}
                                disabled={isUpperNow}
                                />
                            {isUpperNow && isNowDisplayed ? (
                                <div
                                    className="custom-time--mask"
                                    onClick={this.handleNowOff}
                                />
                            ) : null}
                        </div>
                    </div>
                    <div
                        className="custom-time--apply btn btn-sm btn-primary"
                        onClick={this.handleClick}
                        >
                        Apply
                    </div>
                </div>
            </div>
        )
    }
}

CustomTimeRange.defaultProps = {
    shortcuts: timeRangeDefaults,
    handleTimeRangeShortcut: defaultTimeRangeShortcut,
    now: 'upper',
}

const {func, shape, string} = PropTypes

CustomTimeRange.propTypes = {
    onApplyTimeRange: func.isRequired,
    timeRange: shape({
        lower: string.isRequired,
        upper: string,
        }).isRequired,
    onClose: func,
    page: string,
    shortcuts: arrayOf(shape({
        id: string.isRequired,
        name: string.isRequired,
        })),
    handleTimeRangeShortcut: func,
    now: string.isRequired,
}

export default CustomTimeRange
