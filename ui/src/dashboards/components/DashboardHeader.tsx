import React, {Component} from 'react'
import classnames from 'classnames'

import Authorized, {EDITOR_ROLE} from 'src/auth/Authorized'

import PageHeader from 'src/reusable_ui/components/page_layout/PageHeader'
import PageHeaderTitle from 'src/reusable_ui/components/page_layout/PageHeaderTitle'
import AutoRefreshDropdown from 'src/shared/components/AutoRefreshDropdown'
import TimeRangeDropdown from 'src/shared/components/TimeRangeDropdown'
import GraphTips from 'src/shared/components/GraphTips'
import DashboardHeaderEdit from 'src/dashboards/components/DashboardHeaderEdit'
import DashboardSwitcher from 'src/dashboards/components/DashboardSwitcher'

import * as AppActions from 'src/types/actions/app'
import * as DashboardsModels from 'src/types/dashboards'
import * as QueriesModels from 'src/types/queries'

interface State {
  selected: QueriesModels.TimeRange
}

interface Props {
  activeDashboard: string
  dashboard: DashboardsModels.Dashboard
  onEditDashboard: () => void
  timeRange: QueriesModels.TimeRange
  autoRefresh: number
  isEditMode?: boolean
  handleChooseTimeRange: (timeRange: QueriesModels.TimeRange) => void
  handleChooseAutoRefresh: AppActions.SetAutoRefreshActionCreator
  onManualRefresh: () => void
  handleClickPresentationButton: AppActions.DelayEnablePresentationModeDispatcher
  onAddCell: () => void
  onToggleTempVarControls: () => void
  showTemplateControlBar: boolean
  zoomedTimeRange: QueriesModels.TimeRange
  onCancel: () => void
  onSave: (name: string) => Promise<void>
  dashboardLinks: DashboardsModels.DashboardSwitcherLinks
  isHidden: boolean
}

class DashboardHeader extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    zoomedTimeRange: {
      upper: null,
      lower: null,
    },
  }

  public static getDerivedStateFromProps(props: Props): Partial<State> {
    const {upper, lower} = props.zoomedTimeRange

    if (upper || lower) {
      return {selected: {upper, lower}}
    }

    return {}
  }

  constructor(props: Props) {
    super(props)

    const {timeRange, zoomedTimeRange} = props

    this.state = {
      selected: {
        upper: timeRange.upper || zoomedTimeRange.upper,
        lower: timeRange.lower || zoomedTimeRange.lower,
      },
    }
  }

  public render() {
    const {isHidden} = this.props

    return (
      <PageHeader
        fullWidth={true}
        sourceIndicator={true}
        titleComponents={this.renderPageTitle}
        optionsComponents={this.optionsComponents}
        inPresentationMode={isHidden}
      />
    )
  }

  private get renderPageTitle(): JSX.Element {
    return (
      <>
        {this.dashboardSwitcher}
        {this.dashboardTitle}
      </>
    )
  }

  private get optionsComponents(): JSX.Element {
    const {handleChooseAutoRefresh, onManualRefresh, autoRefresh} = this.props

    const {selected} = this.state

    return (
      <>
        <GraphTips />
        {this.addCellButton}
        {this.tempVarsButton}
        <AutoRefreshDropdown
          onChoose={handleChooseAutoRefresh}
          onManualRefresh={onManualRefresh}
          selected={autoRefresh}
          iconName="refresh"
        />
        <TimeRangeDropdown
          onChooseTimeRange={this.handleChooseTimeRange}
          selected={selected}
        />
        <button
          className="btn btn-default btn-sm btn-square"
          onClick={this.handleClickPresentationButton}
        >
          <span className="icon expand-a" />
        </button>
      </>
    )
  }

  private handleChooseTimeRange = (
    timeRange: QueriesModels.TimeRange
  ): void => {
    this.setState({selected: timeRange}, () => {
      window.setTimeout(() => {
        this.props.handleChooseTimeRange(timeRange)
      }, 0)
    })
  }

  private handleClickPresentationButton = (): void => {
    this.props.handleClickPresentationButton()
  }

  private get addCellButton(): JSX.Element {
    const {dashboard, onAddCell} = this.props

    if (dashboard) {
      return (
        <Authorized requiredRole={EDITOR_ROLE}>
          <button className="btn btn-primary btn-sm" onClick={onAddCell}>
            <span className="icon plus" />
            Add Cell
          </button>
        </Authorized>
      )
    }
  }

  private get tempVarsButton(): JSX.Element {
    const {
      dashboard,
      showTemplateControlBar,
      onToggleTempVarControls,
    } = this.props

    if (dashboard) {
      return (
        <div
          className={classnames('btn btn-default btn-sm', {
            active: showTemplateControlBar,
          })}
          onClick={onToggleTempVarControls}
        >
          <span className="icon cube" />Template Variables
        </div>
      )
    }
  }

  private get dashboardSwitcher(): JSX.Element {
    const {dashboardLinks} = this.props

    if (dashboardLinks.links.length > 1) {
      return <DashboardSwitcher dashboardLinks={dashboardLinks} />
    }
  }

  private get dashboardTitle(): JSX.Element {
    const {
      dashboard,
      activeDashboard,
      onSave,
      onCancel,
      onEditDashboard,
      isEditMode,
    } = this.props

    if (dashboard) {
      return (
        <Authorized
          requiredRole={EDITOR_ROLE}
          replaceWithIfNotAuthorized={
            <PageHeaderTitle title={activeDashboard} />
          }
        >
          <DashboardHeaderEdit
            onSave={onSave}
            onCancel={onCancel}
            activeDashboard={activeDashboard}
            onEditDashboard={onEditDashboard}
            isEditMode={isEditMode}
          />
        </Authorized>
      )
    }

    return <PageHeaderTitle title={activeDashboard} />
  }
}

export default DashboardHeader
