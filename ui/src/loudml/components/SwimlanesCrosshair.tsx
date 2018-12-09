import _ from 'lodash'
import React, {PureComponent} from 'react'
import Dygraph from 'dygraphs'
import {ErrorHandling} from 'src/shared/decorators/errors'

import {DYGRAPH_CONTAINER_XLABEL_MARGIN} from 'src/shared/constants'

interface Props {
  hoverTime: number
  dygraph: Dygraph
  staticLegendHeight: number
}

@ErrorHandling
class SwimlanesCrosshair extends PureComponent<Props> {
  public render() {
    if (!this.isVisible) {
      return <div className="crosshair-container" />
    }

    return (
      <div className="crosshair-container">
        <div
          className="crosshair"
          style={{
            transform: this.crosshairLeft,
            height: this.crosshairHeight,
          }}
        />
      </div>
    )
  }

  private get isVisible() {
    const {dygraph} = this.props
    const timeRanges = dygraph.xAxisRange()

    const minTimeRange = _.get(timeRanges, '0', 0)
    // const isBeforeMinTimeRange = hoverTime < minTimeRange

    const maxTimeRange = _.get(timeRanges, '1', Infinity)
    // const isPastMaxTimeRange = hoverTime > maxTimeRange

    // const isValidHoverTime = !isBeforeMinTimeRange && !isPastMaxTimeRange
    // return isValidHoverTime && hoverTime !== 0 && _.isFinite(hoverTime)
    return true
  }

  private get crosshairLeft(): string {
    const {dygraph} = this.props
    const cursorOffset = 16
    return `translateX(${dygraph.toDomXCoord(0) + cursorOffset}px)`
  }

  private get crosshairHeight(): string {
    return `calc(100% - ${this.props.staticLegendHeight +
      DYGRAPH_CONTAINER_XLABEL_MARGIN}px)`
  }
}

export default SwimlanesCrosshair
